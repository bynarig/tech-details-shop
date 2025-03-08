interface OrderFilterProps {
	filters: {
	  status: string;
	  dateFrom: string;
	  dateTo: string;
	  search: string;
	};
	onFilterChange: (filters: any) => void;
  }
  
  export default function OrderFilter({ filters, onFilterChange }: OrderFilterProps) {
	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
	  onFilterChange({ status: e.target.value });
	};
  
	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	  onFilterChange({ [e.target.name]: e.target.value });
	};
  
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	  onFilterChange({ search: e.target.value });
	};
  
	return (
	  <div className="bg-white p-4 rounded-lg shadow-md">
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
		  <div className="form-control">
			<label className="label">
			  <span className="label-text">Search</span>
			</label>
			<input
			  type="text"
			  placeholder="Order # or customer name"
			  className="input input-bordered w-full"
			  value={filters.search}
			  onChange={handleSearchChange}
			/>
		  </div>
		  
		  <div className="form-control">
			<label className="label">
			  <span className="label-text">Status</span>
			</label>
			<select 
			  className="select select-bordered w-full"
			  value={filters.status}
			  onChange={handleStatusChange}
			>
			  <option value="">All Statuses</option>
			  <option value="pending">Pending</option>
			  <option value="processing">Processing</option>
			  <option value="completed">Completed</option>
			  <option value="cancelled">Cancelled</option>
			</select>
		  </div>
  
		  <div className="form-control">
			<label className="label">
			  <span className="label-text">Date From</span>
			</label>
			<input
			  type="date"
			  name="dateFrom"
			  className="input input-bordered w-full"
			  value={filters.dateFrom}
			  onChange={handleDateChange}
			/>
		  </div>
  
		  <div className="form-control">
			<label className="label">
			  <span className="label-text">Date To</span>
			</label>
			<input
			  type="date"
			  name="dateTo"
			  className="input input-bordered w-full"
			  value={filters.dateTo}
			  onChange={handleDateChange}
			/>
		  </div>
		</div>
	  </div>
	);
  }