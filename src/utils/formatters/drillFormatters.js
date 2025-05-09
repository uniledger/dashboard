import { Link } from 'react-router-dom';

/** Drill cell renderers, functions for formatting drillable fields */

/**
 * Creates a React Router `<Link>` component for AG Grid cell rendering.
 * This allows for creating clickable links within grid cells that navigate to other parts of the application.
 *
 * @param {string} path - The base path for the link (e.g., 'entities', 'accounts').
 * @param {string} text - The text to display for the link.
 * @param {string|number} id - The ID of the item to link to, appended to the path.
 * @returns {JSX.Element} A React Router `<Link>` component.
 */
export const drillFormatter = (path, text, id) => {
    return (
        <Link to={`/${path}/${id}`} className="text-blue-600 hover:text-blue-800 hover:underline">{text}</Link>
    );
};