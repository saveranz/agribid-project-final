import api from "./axios";

//create
//update
//delete
export const getCars = async () => {
    return api.get('/api/v1/cars');
};
