import { useState, useContext, useRef, useEffect } from 'react';
import DataContext from '../../Contexts/DataContexts';
import Parcels from '../../Contexts/Parcels';
import getBase64 from '../../Functions/getBase64';
import axios from 'react';

function Create() {

    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [container, setContainer] = useState(0);
    const [flamable, setFlamable] = useState(false);
    const [expiration, setExpiration] = useState(false);
    const fileInput = useRef();

    const { setCreateData, containers, containersList } = useContext(Parcels);
    const { makeMsg } = useContext(DataContext);

    const [photoPrint, setPhotoPrint] = useState(null);


    const doPhoto = () => {
        getBase64(fileInput.current.files[0])
            .then(photo => setPhotoPrint(photo))
            .catch(_ => {
                // tylim
            });
    };

    const add = () => {
        if (name.length === 0 || name.length > 50) {
            makeMsg('Invalid title', 'error');
            return;
        }
        if (weight.replace(/[^\d.]/, '') !== weight) {
            makeMsg('Invalid weight', 'error');
            return;
        }
        if (parseFloat(weight) > 999.99) {
            makeMsg('Max weight is 999.99', 'error');
            return;
        }
console.log(container)
        setCreateData({
            name,
            weight: parseFloat(weight),
            image: photoPrint,
            flamable: flamable ? 1 : 0,
            expiration: expiration ? 1 : 0,
            container_id: container

        });

        setName('');
        setWeight('');
        setPhotoPrint(null);
        fileInput.current.value = null;
        setFlamable(false);
        setExpiration(false);
        setContainer(0)


    };
    console.log(containersList)

    return (
        <div className="card m-4">
            <h5 className="card-header">Create Parcel</h5>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Weight</label>
                    <input maxLength={5} type="text" className="form-control" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Parcel Image</label>
                    <input ref={fileInput} type="file" className="form-control" onChange={doPhoto} />
                </div>
                {photoPrint ? <div className='img-bin'><img src={photoPrint} alt="upload"></img></div> : null}
                <div className="mb-3">
                    <label className="form-label">Is it flammable?</label>
                    <input type="Checkbox" checked={flamable} value={flamable} onChange={() => setFlamable(e => !e)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Is it expiration?</label>
                    <input type="Checkbox" checked={expiration} value={expiration} onChange={() => setExpiration(e => !e)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Select container size</label>
                    <select className="form-select" value={container} onChange={e => setContainer(e.target.value)}>
                    <option value={0} disabled>Choose from list</option>
                        {
                            containersList?.map(c => <option key={c.id} value={c.id}>{c.number}</option>)
                        }
                    </select>

                </div>

            </div>
            <button onClick={add} type="button" className="btn btn-outline-success">Add</button>
        </div>
    );
}

export default Create;