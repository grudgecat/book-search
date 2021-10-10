import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';
import { useQuery } from '@apollo/client';
// import { useParams } from 'react-router-dom'; 

//TODO: 	
// * Remove the `useEffect()` Hook that sets the state for `UserData`.
// * Instead, use the `useQuery()` Hook to execute the `GET_ME` query on load and save it to a variable named `userData`.
// * Use the `useMutation()` Hook to execute the `REMOVE_BOOK` mutation in the `handleDeleteBook()` function instead of
//      the `deleteBook()` function that's imported from `API` file. (Make sure you keep the `removeBookId()` function in place!)
// * `SignupForm.js`: Replace the `addUser()` functionality imported from the `API` file with the `ADD_USER` mutation functionality.
// * `LoginForm.js`: Replace the `loginUser()` functionality imported from the `API` file with the `LOGIN_USER` mutation functionality.

const SavedBooks = () => {
  const { userData } = useQuery(GET_ME, {
    fetchPolicy: "no-cache"
  })
};

// create function that accepts the book's mongo _id value as param and deletes the book from the database
const handleDeleteBook = async (bookId) => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    return false;
  }

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  try {

    const { data } = await removeBook({
      variables: { bookId },
    });

    // upon success, remove book's id from localStorage
    removeBookId(bookId);
  } catch (err) {
    console.error(err);
  }
};

return (
  <>
    <Jumbotron fluid className='text-light bg-dark'>
      <Container>
        <h1>Viewing saved books!</h1>
      </Container>
    </Jumbotron>
    <Container>
      <h2>
        {userData.savedBooks.length
          ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
          : 'You have no saved books!'}
      </h2>
      <CardColumns>
        {userData.savedBooks.map((book) => {
          return (
            <Card key={book.bookId} border='dark'>
              {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className='small'>Authors: {book.authors}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </CardColumns>
    </Container>
  </>
);


export default SavedBooks;
