import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vacanciesService from '../api/vacancies';
import { IconBuilding, IconMapPin, IconClock, IconLink as LinkIcon } from '@tabler/icons-react';

const Vacancy = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await vacanciesService.deleteVacancy(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete vacancy');
        console.error('Error deleting vacancy:', err);
      }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {vacancy.title}
              </h1>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  vacancy.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : vacancy.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {vacancy.status}
              </span>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <IconBuilding className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Company Name
                      </p>
                      <p className="text-sm text-gray-900">
                        {vacancy.company_name}
                      </p>
                    </div>
                  </div>
                  {vacancy.company_address && (
                    <div className="flex items-start">
                      <IconMapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Company Address
                        </p>
                        <p className="text-sm text-gray-900">
                          {vacancy.company_address}
                        </p>
                      </div>
                    </div>
                  )}
                  {vacancy.logo && (
                    <div className="flex items-start">
                      <LinkIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Logo URL
                        </p>
                        <a
                          href={vacancy.logo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          {vacancy.logo}
                        </a>
                      </div>
                    </div>
                  )}
                  {vacancy.hh_id && (
                    <div className="flex items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          HH.ru ID
                        </p>
                        <p className="text-sm text-gray-900">
                          {vacancy.hh_id}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Details
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <IconClock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Created At
                      </p>
                      <p className="text-sm text-gray-900">
                        {new Date(vacancy.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Status
                    </p>
                    <p className="text-sm text-gray-900">
                      {vacancy.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-900">{vacancy.description}</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/edit/${id}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >Delete</button></div></div></div></div>)}

              export default Vacancy;