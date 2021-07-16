import { gql } from '@apollo/client';

export const CREATE_MESSAGE_MUTATION = gql`
mutation
    createMessage( $key:String,$body:String,$me:String){
        createMessage(key:$key,body:$body,me:$me){
            body
            sender{
              name
            }
        }
    }

    
`;