import api from "./api";

const BASE = "/treatment-records";

const treatmentRecordService = {

    downloadDocument: (id) => `${api.defaults.baseURL}${BASE}/${id}/document`,

    getAll: () => api.get(BASE).then((res) => res.data.data ?? res.data),
    getById: (id) => api.get(`${BASE}/${id}`).then((res) => res.data.data ?? res.data),
    getByHospital: (hospitalId) => api.get(`${BASE}/hospital/${hospitalId}`).then((res) => res.data.data ?? res.data),
    getByUser: (userId) => api.get(`${BASE}/user/${userId}`).then((res) => res.data.data ?? res.data),
    getByPolicy: (policyId) => api.get(`${BASE}/policy/${policyId}`).then((res) => res.data.data ?? res.data),
    create: (record) => api.post(BASE, record).then((res) => res.data.data ?? res.data),
    update: (id, record) => api.put(`${BASE}/${id}`, record).then((res) => res.data.data ?? res.data),
    uploadDocument: (id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api
            .post(`${BASE}/${id}/document`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => res.data.data ?? res.data);
    },
};

export default treatmentRecordService;