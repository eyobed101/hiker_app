import React, { createContext, useState, useContext } from 'react';
import { lang } from './language'; 

const LanguageContext = createContext();
    
export const useLanguage = () =>  useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); 

    const toggleLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
    };
    
    const translate = (word) => {
        return lang[language][word] || word; 
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};


