import { useContext } from 'react';
import Parcels from '../../Contexts/Parcels';
import Line from './Line';

function List() {

    const { parcels } = useContext(Parcels);

    return (
        <div className="card m-4">
            <h5 className="card-header">Parcels List</h5>
            <div className="card-body">
                <ul className="list-group">
                    {
                        parcels?.map(p => <Line key={p.id} parcel={p} />)
                    }
                </ul>
            </div>
        </div>
    );
}

export default List;