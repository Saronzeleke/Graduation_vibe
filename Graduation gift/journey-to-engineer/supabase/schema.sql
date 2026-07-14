-- The Journey to Engineer - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Graduates table (single graduate for this project)
CREATE TABLE graduates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    university VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    graduation_date DATE NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline events table
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    graduate_id UUID REFERENCES graduates(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    graduate_id UUID REFERENCES graduates(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (from family and friends)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    graduate_id UUID REFERENCES graduates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100),
    message TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bible verses table
CREATE TABLE bible_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse TEXT NOT NULL,
    reference VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_timeline_events_graduate ON timeline_events(graduate_id);
CREATE INDEX idx_timeline_events_date ON timeline_events(event_date);
CREATE INDEX idx_gallery_images_graduate ON gallery_images(graduate_id);
CREATE INDEX idx_messages_graduate ON messages(graduate_id);
CREATE INDEX idx_messages_approved ON messages(approved);

-- Enable Row Level Security
ALTER TABLE graduates ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON graduates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON timeline_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read approved messages" ON messages FOR SELECT USING (approved = true);
CREATE POLICY "Public read access" ON bible_verses FOR SELECT USING (true);

-- Public insert for messages (for submission form)
CREATE POLICY "Public can submit messages" ON messages FOR INSERT WITH CHECK (true);

-- Sample data insertion
INSERT INTO graduates (name, bio, university, degree, graduation_date, photo_url)
VALUES (
    'Your Name',
    'A passionate Software Engineering student with a heart for God and a love for technology. This journey has been filled with challenges, growth, and countless blessings.',
    'Derbre Brehan Univeristy',
    'Bachelor of Science in Software Engineering',
    '2026-06-15',
    NULL
);

-- Get the graduate ID for sample data (will be the first one)
DO $$
DECLARE
    grad_id UUID;
BEGIN
    SELECT id INTO grad_id FROM graduates LIMIT 1;

    -- Sample timeline events
    INSERT INTO timeline_events (graduate_id, title, description, event_date, order_index) VALUES
    (grad_id, 'First Day of University', 'Started the journey towards becoming a Software Engineer. Nervous but excited for what lies ahead.', '2022-09-01', 1),
    (grad_id, 'First Programming Project', 'Built my first full-stack application. It wasn''t perfect, but it sparked a passion for development.', '2023-01-15', 2),
    (grad_id, 'Internship Experience', 'Landed my first internship and learned what real-world software development looks like.', '2024-06-01', 3),
    (grad_id, 'Final Year Project', 'Completed capstone project - a testament to everything learned throughout the program.', '2026-04-20', 4),
    (grad_id, 'Graduation Day', 'Walked across the stage and received my degree. A dream fulfilled by God''s grace.', '2026-06-15', 5);

    -- Sample Bible verses
    INSERT INTO bible_verses (verse, reference, order_index) VALUES
    ('For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', 'Jeremiah 29:11', 1),
    ('I can do all things through Christ who strengthens me.', 'Philippians 4:13', 2),
    ('Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', 'Proverbs 3:5-6', 3),
    ('Commit to the Lord whatever you do, and he will establish your plans.', 'Proverbs 16:3', 4);
END $$;
