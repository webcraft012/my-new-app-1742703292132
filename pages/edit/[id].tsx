
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';

const EditToDoPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id !== 'new';

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      // Fetch to-do item data based on ID
      // Replace with actual API call
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/todos/${id}`);
          const data = await response.json();
          setTitle(data.title);
          setDueDate(data.dueDate);
          setPriority(data.priority);
          // Handle attachment if needed
        } catch (error) {
          console.error('Error fetching to-do item:', error);
        }
      };

      fetchData();
    }
  }, [id, isEditMode]);

  const handleSave = () => {
    // Save or update to-do item
    console.log('Saving to-do item:', { title, dueDate, priority, attachment });
    router.push('/'); // Redirect to home page after saving
  };

  const handleDelete = () => {
    // Delete to-do item
    console.log('Deleting to-do item:', id);
    router.push('/'); // Redirect to home page after deleting
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={isEditMode ? 'Edit To-Do' : 'Add To-Do'}
        showBackButton
        onBack={() => router.back()}
        showSaveButton
        onSave={handleSave}
      />
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
          <div className="flex items-center">
            <label className="mr-4">
              <input
                type="radio"
                value="High"
                checked={priority === 'High'}
                onChange={() => setPriority('High')}
                className="mr-2"
              />
              High
            </label>
            <label className="mr-4">
              <input
                type="radio"
                value="Medium"
                checked={priority === 'Medium'}
                onChange={() => setPriority('Medium')}
                className="mr-2"
              />
              Medium
            </label>
            <label>
              <input
                type="radio"
                value="Low"
                checked={priority === 'Low'}
                onChange={() => setPriority('Low')}
                className="mr-2"
              />
              Low
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="attachment" className="block text-gray-700 text-sm font-bold mb-2">
            Attachment
          </label>
          <input
            type="file"
            id="attachment"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleAttachmentChange}
          />
          {attachment && (
            <p className="text-gray-600 text-sm mt-1">
              Selected file: {attachment.name}
            </p>
          )}
        </div>

        {isEditMode && (
          <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditToDoPage;
