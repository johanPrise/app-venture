import React from 'react';
import Form from 'next/form';
import SearchFormReset from './SearchFormReset';
import {Search} from 'lucide-react'
const SearchForm = ({query, sort}: {query?: string, sort?: string}) => {

  return (
    <Form action={"/"} scroll={false} className='search-form'>
        <input
        name='query'
        defaultValue=""
        className='search-input'
        placeholder='Search Startups'/>
        {sort && sort !== 'recent' && <input type='hidden' name='sort' value={sort}/>}

        <div className='flex gap-2'>
        {query && 
            <SearchFormReset/>
        }
        <button title='search' type='submit' className='search-btn text-white'>
                <Search className='size-5'/>
                </button>
        </div>
      
    </Form>
  )
}

export default SearchForm
