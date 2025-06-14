import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
}

const emojiCategories = {
  'Activities': ['🏃', '🚴', '🏊', '🧘', '💪', '🏋️', '🤸', '🚶', '🏃‍♀️', '🚴‍♀️'],
  'Health': ['💊', '🩺', '🫀', '🧠', '💧', '🥗', '🍎', '🥕', '🥬', '🫐'],
  'Learning': ['📚', '📖', '✍️', '📝', '🎓', '🧮', '🔬', '🎨', '🎵', '🎸'],
  'Work': ['💻', '📊', '📈', '💼', '📋', '📅', '⏰', '📞', '✉️', '📌'],
  'Lifestyle': ['🏠', '🧹', '🛏️', '🍳', '☕', '🌱', '🌸', '🕯️', '📱', '📺'],
  'Social': ['👥', '💬', '📞', '🤝', '❤️', '👨‍👩‍👧‍👦', '🎉', '🎂', '🎁', '📸'],
  'Mindfulness': ['🧘‍♀️', '🙏', '☮️', '🕉️', '🌅', '🌙', '⭐', '🌈', '🦋', '🌺'],
  'Habits': ['✅', '🎯', '🔥', '⚡', '💎', '🏆', '🎖️', '🌟', '💫', '✨']
};

export function EmojiPicker({ selectedEmoji, onEmojiSelect }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('Activities');

  return (
    <Card className="glass border-gold-500/20 w-full max-w-sm" role="dialog" aria-label="Emoji picker">
      <CardContent className="p-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 mb-4" role="tablist" aria-label="Emoji categories">
          {Object.keys(emojiCategories).map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              size="sm"
              className={`text-xs focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900 ${
                activeCategory === category
                  ? 'gold-gradient text-royal-900'
                  : 'text-gray-400 hover:text-gold-500 hover:bg-gold-500/10'
              }`}
              onClick={() => setActiveCategory(category)}
              role="tab"
              aria-selected={activeCategory === category}
              aria-controls={`emoji-panel-${category}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Emoji grid */}
        <ScrollArea className="h-32">
          <div 
            className="grid grid-cols-5 gap-2" 
            role="tabpanel" 
            id={`emoji-panel-${activeCategory}`}
            aria-labelledby={`tab-${activeCategory}`}
          >
            {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900 ${
                  selectedEmoji === emoji
                    ? 'bg-gold-500/20 ring-1 ring-gold-500'
                    : 'hover:bg-gold-500/10'
                }`}
                onClick={() => onEmojiSelect(emoji)}
                aria-label={`Select ${emoji} emoji`}
                aria-pressed={selectedEmoji === emoji}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}