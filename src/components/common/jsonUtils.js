export const jsonCellRenderer = (props) => {
    return (
        <div className="flex items-center justify-center h-full">
            <button 
                onClick={(e) => {
                    props.context.jsonRowHandler(props.data);
                }}
                className="p-2 rounded-full text-gray-500 bg-gray-50 hover:bg-gray-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 16h8" />
                    <path d="M8 12h8" />
                </svg>
            </button>
        </div>
    );
};