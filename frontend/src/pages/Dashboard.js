import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import vacanciesService from '../api/vacancies';
import VacancyCard from '../components/VacancyCard';

const Dashboard = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const data = await vacanciesService.getVacancies();
        setVacancies(data);
      } catch (err) {
        setError('Failed to fetch vacancies');
        console.error('Error fetching vacancies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading vacancies...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vacancies</h1>
        <Link
          to="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Vacancy
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vacancies.length > 0 ? (
          vacancies.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No vacancies found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;