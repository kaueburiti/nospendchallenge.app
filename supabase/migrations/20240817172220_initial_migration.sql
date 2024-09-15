-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create an enum type for Category
CREATE TYPE category AS ENUM (
    'Development',
    'Productivity',
    'Artificial Intelligence',
    'SEO',
    'Design',
    'Communication',
    'Others'
    );

-- Create the data table
CREATE TABLE data
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    src         TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    href        TEXT    NOT NULL,
    featured    BOOLEAN NOT NULL         DEFAULT FALSE,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the categories table
CREATE TABLE categories
(
    id   SERIAL PRIMARY KEY,
    name category NOT NULL UNIQUE
);

-- Create a junction table for the many-to-many relationship between data and categories
CREATE TABLE data_categories
(
    data_id     UUID REFERENCES data (id) ON DELETE CASCADE,
    category_id INT REFERENCES categories (id) ON DELETE CASCADE,
    PRIMARY KEY (data_id, category_id)
);

-- Insert the predefined categories
INSERT INTO categories (name)
VALUES ('Development'),
       ('Productivity'),
       ('Artificial Intelligence'),
       ('SEO'),
       ('Design'),
       ('Communication'),
       ('Others');

-- Add indexes
CREATE INDEX idx_data_name ON data (name);
CREATE INDEX idx_data_featured ON data (featured);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_data_modtime
    BEFORE UPDATE
    ON data
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();