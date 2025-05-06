
import { Link } from 'react-router-dom';

/** Drill cell renderers, functions for formatting drillable fields */

export const drillFormatter = (path, text, id) => {
    return (
        <Link to={`/${path}/${id}`} className="text-blue-600 hover:text-blue-800 hover:underline">{text}</Link>
    );
};