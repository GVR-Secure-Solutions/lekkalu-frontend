import React, { useContext } from 'react';
import { TextField, Autocomplete, createFilterOptions } from '@mui/material';

const filter = createFilterOptions();

const TagInput = ({myTags, setTags, Context, errorTag}) => {
  
  const { tags } = useContext(Context);

  const handlerGetOptionLabel = (option) =>{
    return option.name 
  }
  
  const handleChange = (_, newValue) =>{
    setTags(newValue);
  }

  return (
    <div>
      <Autocomplete
        multiple
        value={myTags || []}
        onChange={handleChange}
        getOptionLabel={handlerGetOptionLabel}
        filterOptions={(options, params)=>{

            const filtered = filter(options, params);

            const { inputValue } = params
            const getFirstUpperCase = () =>{
              if(inputValue.length === 0)  return
              return  inputValue.replace(inputValue[0], inputValue[0].toUpperCase())
            }
            const value = getFirstUpperCase()
            
            const isExisting = options.some((option) => value === option.name);

            if (value !== '' && !isExisting) {
              filtered.push({
                name: inputValue.trim(),
              });
            }
            return filtered;

        }}
        options={tags}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tag"
            error={errorTag}
            variant="outlined"
            helperText="Select a tag from the list"
            data-testid="tags-expense"
            fullWidth
          />
        )}
      />
    
    </div>
  );
};

export default TagInput;
