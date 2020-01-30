export class PersistanceService {
    setItem(key: string, value: object){        
        sessionStorage.setItem(key, JSON.stringify(value));        
    }

    getItem(key: string): object{        
        const value = sessionStorage.getItem(key);  
        
        if(!value)
            return null;
        
        return JSON.parse(value);
    }
}