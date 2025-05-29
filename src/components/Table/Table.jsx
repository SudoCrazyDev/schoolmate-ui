
const ReusableTable = ({
    items=[],
    headers = [],
    renderRow
}) => {
    
    return(
        <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {headers.map(head => (
                                <th key={crypto.randomUUID()} scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.length > 0 && items.map((item, index) => renderRow(item, index))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    );
};

export default ReusableTable;
