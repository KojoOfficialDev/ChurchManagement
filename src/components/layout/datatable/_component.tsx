import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ILinkedSubscriber } from '../../../core/interfaces';

type Props = {
	data: ILinkedSubscriber[];
};

const Datatable: React.FC<Props> = ({ data }) => {
	const navigate = useNavigate();

	return (
		<>
			<div className='custom-table'>
				<table>
					<thead>
						<tr>
							<th>
								<div>Linked Msisdn</div>
							</th>
							<th>
								<div>Created at</div>
							</th>
							<th>
								<div>Action</div>
							</th>
						</tr>
					</thead>
					<tbody className='list'>
						{data.length ? (
							data.map((value, idx) => {
								return (
									<tr key={idx}>
										<td className=''>{value.msisdn}</td>
										<td className=''>
											<button
												title='View details of a particular data sim'
												className='bg-black text-white text-[10px] hover:bg-[#fc0] hover:font-bold hover:text-black px-2 py-1  rounded'
												onClick={() => navigate('/view-sim/3')}
											>
												Remove
											</button>
										</td>
									</tr>
								);
							})
						) : (
							<tr className='uk-alert-warning'>
								<td colSpan={6}>
									{' '}
									<div className='bg-blue-100 text-[11px] rounded-lg py-5 px-6 text-blue-700'>
										No Records found
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Datatable;
