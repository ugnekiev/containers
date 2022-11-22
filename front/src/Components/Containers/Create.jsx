import { useState, useContext } from "react";
import Containers from "../../Contexts/Containers";
import { v4 as uuidv4 } from "uuid";
// import DataContext from '../../Contexts/DataContext';

function Create() {
    const [number, setNumber] = useState(uuidv4())
    const [size, setSize] = useState("");

    const { setCreateData } = useContext(Containers);
    // const {makeMsg} = useContext(DataContext);

    const add = () => {
        //     if (title.length === 0 || title.length > 50) {
        //         makeMsg('Invalid title', 'error');
        //         return;
        //     }
        //     if (price.replace(/[^\d.]/, '') !== price) {
        //         makeMsg('Invalid price', 'error');
        //         return;
        //     }
        //     if (parseFloat(price) > 99.99) {
        //         makeMsg('Max price is 99.99', 'error');
        //         return;
        //     }

        setCreateData({
            number,
            size: size,
        });
        setNumber(uuidv4())
        setSize("");
    };

    return (
        <div className="card m-4">
            <h5 className="card-header">New Container</h5>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Container number</label>
                    <input type="text" className="form-control" value={number} readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">Container size</label>
                    <select className="form-select"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}>
                        <option value={0} disabled>Please, select</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </div>
                <button onClick={add} type="button" className="btn btn-outline-success">
                    Add
                </button>
            </div>
        </div>
    );
}

export default Create;
