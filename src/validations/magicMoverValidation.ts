import Validator from 'validatorjs';

export const addMagicMoverValidator = (data: any) => {
    const rules = {
        name: 'required|string',
        weightLimit: 'required|integer',
        energy: 'required|integer'
    };

    return new Validator(data, rules);
}

export const loadMagicMoverValidator = (data: any) => {
    const rules = {
        moverId: 'required|integer',
        items: 'required|array',
        'items.*': 'integer'
    };

    return new Validator(data, rules);
}