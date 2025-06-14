import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmojiPicker } from './EmojiPicker';

interface Habit {
  id?: string;
  name: string;
  emoji: string;
  reminderTime: string;
  selectedDays: string[];
}

interface AddEditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  habit?: Habit | null;
}

const daysOfWeek = [
  { short: 'M', full: 'Monday', value: 'monday' },
  { short: 'T', full: 'Tuesday', value: 'tuesday' },
  { short: 'W', full: 'Wednesday', value: 'wednesday' },
  { short: 'T', full: 'Thursday', value: 'thursday' },
  { short: 'F', full: 'Friday', value: 'friday' },
  { short: 'S', full: 'Saturday', value: 'saturday' },
  { short: 'S', full: 'Sunday', value: 'sunday' },
];

export function AddEditHabitModal({ isOpen, onClose, onSave, habit }: AddEditHabitModalProps) {
  const [formData, setFormData] = useState<Habit>({
    name: '',
    emoji: '🎯',
    reminderTime: '09:00',
    selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (habit) {
      setFormData(habit);
    } else {
      setFormData({
        name: '',
        emoji: '🎯',
        reminderTime: '09:00',
        selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      });
    }
    setNameError('');
  }, [habit, isOpen]);

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setNameError('Habit name is required');
      return false;
    }
    if (formData.selectedDays.length === 0) {
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md"
          >
            <Card className="glass border-gold-500/30 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle id="modal-title" className="royal-text text-xl">
                    {habit ? 'Edit Habit' : 'Add New Habit'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gold-500 hover:bg-gold-500/10 h-8 w-8 p-0 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                    aria-label="Close modal"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <p id="modal-description" className="text-sm text-gray-400">
                  {habit ? 'Update your habit details' : 'Create a new habit to track your progress'}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Emoji Picker */}
                <div className="space-y-2">
                  <Label className="text-gold-500 font-medium">Choose Icon</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className="w-16 h-16 text-2xl border-gold-500/30 hover:bg-gold-500/10 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      aria-label={`Current icon: ${formData.emoji}. Click to change`}
                      aria-expanded={showEmojiPicker}
                      aria-haspopup="true"
                    >
                      {formData.emoji}
                    </Button>
                    <div className="text-sm text-gray-400">
                      Click to choose an icon for your habit
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <EmojiPicker
                          selectedEmoji={formData.emoji}
                          onEmojiSelect={(emoji) => {
                            setFormData(prev => ({ ...prev, emoji }));
                            setShowEmojiPicker(false);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Habit Name */}
                <div className="space-y-2">
                  <Label htmlFor="habit-name" className="text-gold-500 font-medium">
                    Habit Name *
                  </Label>
                  <Input
                    id="habit-name"
                    placeholder="e.g., Morning Meditation"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (nameError) setNameError('');
                    }}
                    className={`glass border-gold-500/20 focus:border-gold-500/40 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900 ${
                      nameError ? 'border-red-500/50' : ''
                    }`}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "name-error" : undefined}
                    required
                  />
                  {nameError && (
                    <p id="name-error" className="text-red-400 text-sm" role="alert">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Reminder Time */}
                <div className="space-y-2">
                  <Label htmlFor="reminder-time" className="text-gold-500 font-medium flex items-center space-x-2">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <span>Reminder Time</span>
                  </Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
                    className="glass border-gold-500/20 focus:border-gold-500/40 text-white focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                    aria-describedby="time-help"
                  />
                  <p id="time-help" className="text-xs text-gray-500">
                    When would you like to be reminded about this habit?
                  </p>
                </div>

                {/* Days of Week */}
                <fieldset className="space-y-3">
                  <legend className="text-gold-500 font-medium flex items-center space-x-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>Repeat on *</span>
                  </legend>
                  <div className="flex space-x-2" role="group" aria-labelledby="days-legend">
                    {daysOfWeek.map((day, index) => (
                      <motion.button
                        key={day.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900 ${
                          formData.selectedDays.includes(day.value)
                            ? 'gold-gradient text-royal-900 shadow-lg'
                            : 'glass border border-gold-500/30 text-gray-400 hover:text-gold-500 hover:border-gold-500/50'
                        }`}
                        onClick={() => handleDayToggle(day.value)}
                        aria-pressed={formData.selectedDays.includes(day.value)}
                        aria-label={`${day.full} - ${formData.selectedDays.includes(day.value) ? 'selected' : 'not selected'}`}
                      >
                        {day.short}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500" aria-live="polite">
                    {formData.selectedDays.length === 0 
                      ? 'Select at least one day' 
                      : `Active on ${formData.selectedDays.length} day${formData.selectedDays.length > 1 ? 's' : ''} per week`
                    }
                  </p>
                </fieldset>

                {/* Save Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleSave}
                    disabled={!formData.name.trim() || formData.selectedDays.length === 0}
                    className="w-full gold-gradient text-royal-900 font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-royal-900"
                    aria-describedby="save-help"
                  >
                    {habit ? 'Update Habit' : 'Save Habit'}
                  </Button>
                  <p id="save-help" className="sr-only">
                    {habit ? 'Update the habit with your changes' : 'Create a new habit with the specified details'}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}