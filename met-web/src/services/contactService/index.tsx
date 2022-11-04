import http from 'apiManager/httpRequestHandler';
import Endpoints from 'apiManager/endpoints';
import { replaceUrl } from 'helper';
import { Contact } from 'models/contact';

export const getContact = async (contactId: number): Promise<Contact> => {
    const url = replaceUrl(Endpoints.Contacts.GET, 'contact_id', String(contactId));
    try {
        const response = await http.GetRequest<Contact>(url);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getContacts = async (): Promise<Contact[]> => {
    try {
        const response = await http.GetRequest<Contact[]>(Endpoints.Contacts.GET_LIST);
        if (response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to fetch contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

interface PostContactRequest {
    name?: string;
    title?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    bio?: string;
}
export const postContact = async (data: PostContactRequest): Promise<Contact> => {
    try {
        const response = await http.PostRequest<Contact>(Endpoints.Contacts.CREATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to create contact');
    } catch (err) {
        return Promise.reject(err);
    }
};

export const updateContact = async (data: PostContactRequest): Promise<Contact> => {
    try {
        const response = await http.PutRequest<Contact>(Endpoints.Contacts.UPDATE, data);
        if (response.data.status && response.data.result) {
            return Promise.resolve(response.data.result);
        }
        return Promise.reject(response.data.message ?? 'Failed to update contact');
    } catch (err) {
        return Promise.reject(err);
    }
};
