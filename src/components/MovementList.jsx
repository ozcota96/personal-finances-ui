import Moment from "moment";

function MovementList({ movements = [], onEdit, onRemove }) {
  Moment.locale("en");

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleEdit = onEdit || (() => {});
  const handleRemove = onRemove || (() => {});

  if (movements.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
        No movements found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Description</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              {/* <th className="px-4 py-3 font-semibold">Type</th> */}
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Subcategory</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{movement.description}</td>
                <td className={`px-4 py-3 font-semibold ${movement.type === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {movement.type === 0 ? "+" : "-"}
                  {currencyFormatter.format(movement.amount)}
                </td>
                {/* <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      movement.type === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {movement.type === 0 ? "Income" : "Expense"}
                  </span>
                </td> */}
                <td className="px-4 py-3">{Moment(movement.date).format("D MMM YYYY")}</td>
                <td className="px-4 py-3">{movement.category || "-"}</td>
                <td className="px-4 py-3">{movement.subcategory || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(movement)}
                      aria-label={`Edit ${movement.description}`}
                      title="Edit movement"
                      className="rounded-md p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                        <path d="M12 20h9" strokeLinecap="round" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(movement)}
                      aria-label={`Delete ${movement.description}`}
                      title="Delete movement"
                      className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                        <path d="M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 10v7m4-7v7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {movements.map((movement) => (
          <article key={movement.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-800">{movement.description}</p>
                <p className="mt-1 text-xs text-slate-500">{Moment(movement.date).format("D MMM YYYY")}</p>
              </div>
              {/* <span
                className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${
                  movement.type === 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {movement.type === 0 ? "Income" : "Expense"}
              </span> */}
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
                <p className="text-sm font-medium text-slate-700">{movement.category || "-"}</p>
              </div>
              <p className={`text-lg font-bold ${movement.type === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {movement.type === 0 ? "+" : "-"}
                {currencyFormatter.format(movement.amount)}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
              <div className="text-xs text-slate-500">
                {movement.subcategory || "No subcategory"}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(movement)}
                  aria-label={`Edit ${movement.description}`}
                  title="Edit movement"
                  className="rounded-md p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                    <path d="M12 20h9" strokeLinecap="round" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(movement)}
                  aria-label={`Delete ${movement.description}`}
                  title="Delete movement"
                  className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
                    <path d="M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 10v7m4-7v7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default MovementList;