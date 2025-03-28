import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vacanciesService from '../api/vacancies';
import VacancyForm from '../components/VacancyForm';

const EditVacancy = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const data = await vacanciesService.getVacancyById(id);
        setVacancy(data);
      } catch (err) {
        setError('Failed to fetch vacancy');
        console.error('Error fetching vacancy:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancy();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    setError('');
    try {
      await vacanciesService.updateVacancy(id, formData);
      navigate(`/vacancy/${id}`);
    } catch (err) {
      setError('Failed to update vacancy');
      console.error('Error updating vacancy:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading vacancy...</div>;
  }

  if (!vacancy) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Vacancy</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <VacancyForm
            vacancy={vacancy}
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditVacancy;