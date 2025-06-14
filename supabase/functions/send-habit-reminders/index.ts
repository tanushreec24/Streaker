import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          timezone: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          emoji: string
          reminder_time: string | null
          reminder_enabled: boolean
          active_days: string[]
        }
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current day of week
    const now = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = dayNames[now.getDay()]
    
    console.log(`Processing reminders for ${currentDay} at ${now.toISOString()}`)

    // Get all habits with reminders enabled for today
    const { data: habits, error: habitsError } = await supabaseAdmin
      .from('habits')
      .select(`
        *,
        profiles!inner (
          id,
          email,
          full_name,
          timezone
        )
      `)
      .eq('reminder_enabled', true)
      .contains('active_days', [currentDay])

    if (habitsError) {
      console.error('Error fetching habits:', habitsError)
      throw habitsError
    }

    if (!habits || habits.length === 0) {
      console.log('No habits with reminders found for today')
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No reminders to send',
          processed: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Group habits by user
    const userHabits = new Map<string, {
      profile: any
      habits: any[]
    }>()

    habits.forEach(habit => {
      const userId = habit.user_id
      if (!userHabits.has(userId)) {
        userHabits.set(userId, {
          profile: habit.profiles,
          habits: []
        })
      }
      userHabits.get(userId)!.habits.push(habit)
    })

    console.log(`Found ${userHabits.size} users with reminders`)

    // Send reminders to each user
    let emailsSent = 0
    const emailPromises = Array.from(userHabits.entries()).map(async ([userId, userData]) => {
      try {
        const { profile, habits: userHabitList } = userData
        
        // Check if it's time to send reminder based on user's timezone and habit reminder times
        const shouldSendReminder = userHabitList.some(habit => {
          if (!habit.reminder_time) return false
          
          // Convert reminder time to user's timezone
          const userTimezone = profile.timezone || 'UTC'
          const userNow = new Date().toLocaleString('en-US', { timeZone: userTimezone })
          const userCurrentTime = new Date(userNow)
          
          // Parse reminder time (format: "HH:MM")
          const [hours, minutes] = habit.reminder_time.split(':').map(Number)
          const reminderTime = new Date(userCurrentTime)
          reminderTime.setHours(hours, minutes, 0, 0)
          
          // Check if current time is within 1 hour of reminder time
          const timeDiff = Math.abs(userCurrentTime.getTime() - reminderTime.getTime())
          const oneHour = 60 * 60 * 1000
          
          return timeDiff <= oneHour
        })

        if (!shouldSendReminder) {
          console.log(`Skipping reminder for user ${userId} - not time yet`)
          return
        }

        // Create email content
        const habitsList = userHabitList
          .map(habit => `${habit.emoji} ${habit.name}`)
          .join('\n')

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Daily Habit Reminder - Streaker</title>
              <style>
                body { 
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                  line-height: 1.6; 
                  color: #333; 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 20px;
                  background-color: #f8f9fa;
                }
                .container { 
                  background: linear-gradient(135deg, #1a1b3e 0%, #2d39cc 50%, #d4af37 100%);
                  border-radius: 12px; 
                  padding: 30px; 
                  color: white;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                }
                .logo { 
                  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
                  width: 60px; 
                  height: 60px; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  margin: 0 auto 15px;
                  font-size: 24px;
                }
                .title { 
                  background: linear-gradient(135deg, #d4af37 0%, #ffe082 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  font-size: 28px; 
                  font-weight: bold; 
                  margin: 0;
                }
                .subtitle { 
                  color: #e2e8f0; 
                  margin: 5px 0 0; 
                }
                .habits-list { 
                  background: rgba(255,255,255,0.1); 
                  border-radius: 8px; 
                  padding: 20px; 
                  margin: 20px 0;
                  backdrop-filter: blur(10px);
                }
                .habit-item { 
                  padding: 10px 0; 
                  border-bottom: 1px solid rgba(255,255,255,0.1); 
                  font-size: 16px;
                }
                .habit-item:last-child { 
                  border-bottom: none; 
                }
                .cta-button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
                  color: #1a1b3e; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: bold;
                  margin: 20px auto;
                  text-align: center;
                }
                .footer { 
                  text-align: center; 
                  margin-top: 30px; 
                  color: #94a3b8; 
                  font-size: 14px;
                }
                .unsubscribe { 
                  color: #94a3b8; 
                  text-decoration: none; 
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">👑</div>
                  <h1 class="title">Daily Habit Reminder</h1>
                  <p class="subtitle">Time to build your royal habits!</p>
                </div>
                
                <p>Hello ${profile.full_name || 'there'}! 👋</p>
                
                <p>It's time to work on your habits for today. Here's what you planned to accomplish:</p>
                
                <div class="habits-list">
                  ${userHabitList.map(habit => `
                    <div class="habit-item">${habit.emoji} ${habit.name}</div>
                  `).join('')}
                </div>
                
                <p>Remember, consistency is key to building lasting habits. Even small progress counts! 💪</p>
                
                <div style="text-align: center;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'vercel.app') || 'https://your-app.com'}" class="cta-button">
                    Track Your Progress →
                  </a>
                </div>
                
                <div class="footer">
                  <p>Keep building those royal habits! 🏆</p>
                  <p>
                    <a href="#" class="unsubscribe">Manage reminder preferences</a>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `

        // Send email using Supabase Edge Functions email service
        // Note: In production, you'd integrate with a service like SendGrid, Resend, or similar
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Streaker <reminders@streaker.app>',
            to: [profile.email],
            subject: `🎯 Daily Habit Reminder - ${userHabitList.length} habit${userHabitList.length > 1 ? 's' : ''} to complete`,
            html: emailHtml,
          }),
        })

        if (emailResponse.ok) {
          emailsSent++
          console.log(`Reminder sent to ${profile.email}`)
        } else {
          const errorText = await emailResponse.text()
          console.error(`Failed to send email to ${profile.email}:`, errorText)
        }

      } catch (error) {
        console.error(`Error sending reminder to user ${userId}:`, error)
      }
    })

    // Wait for all emails to be processed
    await Promise.all(emailPromises)

    console.log(`Reminder processing complete. Sent ${emailsSent} emails.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${userHabits.size} users, sent ${emailsSent} reminder emails`,
        processed: userHabits.size,
        emailsSent 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in send-habit-reminders function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})