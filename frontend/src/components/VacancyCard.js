import { Link } from 'react-router-dom';
import { IconClock, IconBuilding, IconMapPin, IconEdit } from '@tabler/icons-react';

const VacancyCard = ({ vacancy }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {vacancy.title}
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            vacancy.status === 'active'
              ? 'bg-green-100 text-green-800'
              : vacancy.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {vacancy.status}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <IconBuilding className="mr-1.5 h-4 w-4 text-gray-400" />
            {vacancy.company_name}
          </div>
          {vacancy.company_address && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <IconMapPin className="mr-1.5 h-4 w-4 text-gray-400" />
              {vacancy.company_address}
            </div>
          )}
          {vacancy.created_at && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <IconClock className="mr-1.5 h-4 w-4 text-gray-400" />
              Created: {new Date(vacancy.created_at).toLocaleDateString()}
            </div>
          )}
          <p className="text-sm text-gray-500 line-clamp-3">
            {vacancy.description}
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Link
            to={`/edit/${vacancy.id}`}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <IconEdit className="-ml-0.5 mr-1.5 h-4 w-4" />
            Edit
          </Link>
          <Link
            to={`/vacancy/${vacancy.id}`}
            className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VacancyCard;