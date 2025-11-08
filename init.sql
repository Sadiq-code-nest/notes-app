CREATE DATABASE IF NOT EXISTS notesdb;
USE notesdb;

CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO notes (title, content) VALUES
('Welcome Note', 'Welcome to your minimalistic notes app! Create, edit, and organize your thoughts effortlessly.'),
('Meeting Notes', 'Discuss Q4 roadmap and team objectives. Follow up with stakeholders next week.'),
('Ideas', 'Consider implementing dark mode, tag system, and markdown support in future versions.');
