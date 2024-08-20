import { getMyContents } from 'network/ContentService';
import React, { useState, useEffect } from 'react';


const Contents = () => {

    const [contents,setContents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await getMyContents();
            if (result.success) {
              setContents(result.response);
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, []);

    return (
        <>
        {contents.map((item) => (
            <div>
                <p>{item.name}</p>
            </div>
          ))}
        </>
    );
  
}

export default Contents;