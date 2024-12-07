-- First, clear existing questions (if any)
DELETE FROM answers;
DELETE FROM questions;

-- Basic Questions (1-3)
INSERT INTO questions (title, description, type, order_index, tips) VALUES
('Personal Mission', 'What is your purpose in life? What do you want to contribute to the world?', 'mission', 1, ARRAY['Think about what drives you', 'Consider your lifelong impact', 'What would make you proud?']),
('Personal Vision', 'What kind of person do you want to become? Where do you see yourself in the future?', 'vision', 2, ARRAY['Imagine yourself in the future', 'What does success look like to you?', 'Be specific and ambitious']),
('Core Values', 'Define up to 5 of your strongest core values (e.g., Integrity, Growth, Family, Health)', 'values', 3, ARRAY['Choose values that truly resonate', 'Think about what you stand for', 'Consider what guides your decisions']);

-- 10-25 Year Aspirations (4-7)
INSERT INTO questions (title, description, type, order_index, tips) VALUES
('10-25 Year Relationships Aspirations', 'What are your long-term aspirations for relationships? (Family, friends, network)', 'long_term_aspirations', 4, ARRAY['Think about lasting connections', 'Consider family legacy', 'Include mentorship goals']),
('10-25 Year Achievement Aspirations', 'What major achievements do you want to accomplish in the next 10-25 years?', 'long_term_aspirations', 5, ARRAY['Think big and bold', 'Include career milestones', 'Consider your legacy']),
('10-25 Year Ritual Aspirations', 'What rituals or habits do you want to maintain for the next 10-25 years?', 'long_term_aspirations', 6, ARRAY['Focus on sustainable practices', 'Think about daily/weekly routines', 'Include health and wellness']),
('10-25 Year Wealth & Experience Aspirations', 'What wealth and experiences do you want to accumulate over the next 10-25 years?', 'long_term_aspirations', 7, ARRAY['Consider financial goals', 'Include travel and adventures', 'Think about lifestyle']);

-- 1 Year Activities (8-11)
INSERT INTO questions (title, description, type, order_index, tips) VALUES
('1 Year Relationship Activities', 'List up to 5 relationship-focused activities for the next year', 'one_year_activities', 8, ARRAY['Be specific and actionable', 'Include both personal and professional relationships', 'Think about strengthening existing bonds']),
('1 Year Achievement Activities', 'List up to 5 achievement-focused activities for the next year', 'one_year_activities', 9, ARRAY['Make them measurable', 'Set realistic timelines', 'Include personal and professional goals']),
('1 Year Ritual Activities', 'List up to 5 ritual or habit-focused activities for the next year', 'one_year_activities', 10, ARRAY['Start small and build up', 'Make them sustainable', 'Focus on daily/weekly practices']),
('1 Year Wealth & Experience Activities', 'List up to 5 wealth or experience-focused activities for the next year', 'one_year_activities', 11, ARRAY['Include savings goals', 'Plan specific experiences', 'Consider skill development']);

-- 90 Day START Activities (12-15)
INSERT INTO questions (title, description, type, order_index, tips) VALUES
('90 Day START Relationship Activities', 'List up to 5 relationship activities to START in the next 90 days', 'ninety_day_start', 12, ARRAY['Choose immediate actions', 'Focus on building new connections', 'Include regular check-ins']),
('90 Day START Achievement Activities', 'List up to 5 achievement activities to START in the next 90 days', 'ninety_day_start', 13, ARRAY['Set clear 90-day milestones', 'Make them achievable', 'Include progress tracking']),
('90 Day START Ritual Activities', 'List up to 5 ritual or habit activities to START in the next 90 days', 'ninety_day_start', 14, ARRAY['Start with small habits', 'Make them specific', 'Plan for daily/weekly execution']),
('90 Day START Wealth & Experience Activities', 'List up to 5 wealth or experience activities to START in the next 90 days', 'ninety_day_start', 15, ARRAY['Include immediate financial actions', 'Plan near-term experiences', 'Focus on quick wins']);

-- 90 Day STOP Activities (16-19)
INSERT INTO questions (title, description, type, order_index, tips) VALUES
('90 Day STOP Relationship Activities', 'List up to 5 relationship activities to STOP in the next 90 days', 'ninety_day_stop', 16, ARRAY['Identify toxic patterns', 'Consider time-wasting interactions', 'Focus on quality over quantity']),
('90 Day STOP Achievement Activities', 'List up to 5 achievement activities to STOP in the next 90 days', 'ninety_day_stop', 17, ARRAY['List counterproductive habits', 'Identify distractions', 'Include procrastination triggers']),
('90 Day STOP Ritual Activities', 'List up to 5 ritual or habit activities to STOP in the next 90 days', 'ninety_day_stop', 18, ARRAY['Identify bad habits', 'List time-wasting routines', 'Include energy drains']),
('90 Day STOP Wealth & Experience Activities', 'List up to 5 wealth or experience activities to STOP in the next 90 days', 'ninety_day_stop', 19, ARRAY['List unnecessary expenses', 'Identify resource drains', 'Include time/money wasters']); 