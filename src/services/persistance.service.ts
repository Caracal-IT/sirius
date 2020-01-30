export class PersistanceService {
    setItem(key: string, value: object){        
        localStorage.setItem(key, JSON.stringify(value));        
    }

    getItem(key: string): object{        
        const value = localStorage.getItem(key);  
        
        if(!value)
            return null;
        
        return JSON.parse(value);
    }
}