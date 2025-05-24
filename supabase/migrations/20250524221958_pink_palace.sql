/*
  # Create storage bucket for image uploads

  1. New Storage Bucket
    - Creates a new public storage bucket named 'images' for storing uploaded images
  
  2. Security
    - Enables public access for reading images
    - Restricts upload/delete operations to authenticated users only
*/

-- Create a new storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Policy to allow public access to read images
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'images' );

-- Policy to allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );

-- Policy to allow authenticated users to update their own images
create policy "Authenticated users can update own images"
on storage.objects for update
to authenticated
using ( bucket_id = 'images' AND auth.uid() = owner );

-- Policy to allow authenticated users to delete their own images
create policy "Authenticated users can delete own images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'images' AND auth.uid() = owner );