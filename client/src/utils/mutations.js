
// * `LOGIN_USER` will execute the `loginUser` mutation set up using Apollo Server.
// * `ADD_USER` will execute the `addUser` mutation.
// * `SAVE_BOOK` will execute the `saveBook` mutation.
// * `REMOVE_BOOK` will execute the `removeBook` mutation.

import {gql} from "@apollo/client"

export const LOGIN_USER = gql`
mutation login($email:String!, $password:String!) {
  login(email:$email, password:$password) {
    token
    user{
      username
      email
      savedBooks {
        authors
        bookId
        description
        title
        image
        link
      }
    }
  }
}
`;

export const ADD_USER = gql`
mutation addUser($username:String!, $email:String!, $password:String!) {
  addUser(username:$username, email:$email, password:$password) {
     token
    user{
      username
      email
      savedBooks {
        authors
        bookId
        description
        title
        image
        link
      }
      }
  }
}
`;

export const SAVE_BOOK = gql`
	mutation saveBook ($authors:[String!], $description:String!, $title:String!, $bookId:String!, $image:String!, $link:String!) {
		saveBook(authors:$authors, description:$description, title:$title, bookId:$bookId, image:$image, link:$link) {
      username
      email
      savedBooks {
        authors
        bookId
        description
        title
        image
        link
      }
    }
    }
`;

export const REMOVE_BOOK = gql`
	mutation removeBook($bookId:String!) {
		removeBook(bookId:$bookId) {
      username
      email
      savedBooks {
        authors
        bookId
        description
        title
        image
        link
      }
}}
`;