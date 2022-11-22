import { useContext } from "react";
import Parcels from "../../Contexts/Parcels";

function Line({ parcel }) {

    const { setDeleteData, setModalData, containers } = useContext(Parcels);
    console.log(containers?.find(c=> c.id === parcel.container_id).number)
    return (
        <li className="list-group-item">
            <div className="line_content">
                <div className="line__content__info">
                    {parcel.image ? (
                        <div className="img-bin">
                            <img src={parcel.image} alt={parcel.name}></img>
                        </div>
                    ) : (
                        <div className="no_image">No image</div>
                    )}
                    <div className="line__content">
                        <div className="line__content__title">{parcel.name}</div>
                        <div className="lline__content__info">Weight: <strong>{parcel.weight}</strong> kg</div>
                        <div className="line__content__info">Flamable: {parcel.flammable ? "Yes" : "No"}</div>
                        <div className="lline__content__info">Low expiration: {parcel.perishable ? "Yes" : "No"}</div>
                        <div className="line__content__info">container Number: {containers?.find(c=> c.id === parcel.container_id).number}</div>
                    </div>
                </div>
                <div className="line_buttons">
                    <button onClick={() => setModalData(parcel)} type="button" className="btn btn-outline-success">Edit
                    </button>
                    <button onClick={() => setDeleteData(parcel)} type="button" className="btn btn-outline-danger">Delete
                    </button>
                </div>
            </div>
        </li>
    );
}

export default Line;