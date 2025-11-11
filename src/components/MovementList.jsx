import Moment from 'moment';

function MovementList({movements}) {
    Moment.locale('en');
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    if(movements.length === 0) {
        return <p className="text-gray-600">No movements found.</p>;
    }

    return (
        <div className="bg-white rounded-lg text-gray-600 shadow h-screen p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="p-2">Description</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Subcategory</th>
                    </tr>
                </thead>
                <tbody>
                    {movements.map((movement) => (
                        <tr key={movement.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{movement.description}</td>
                            <td className="p-2">{currencyFormatter.format(movement.amount)}</td>
                            <td>
                                <span className={`px-2 py-1 rounded text-sm ${
                                    movement.type === 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                    {movement.type === 0 ? "Income" : "Expense"} 
                                </span>
                            </td>
                            <td className="p-2">{Moment(movement.date).format("d MMM YYYY")}</td>
                            <td className="p-2">{movement.category?.name || "-"}</td>
                            <td className="p-2">{movement.subcategory?.name || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MovementList;