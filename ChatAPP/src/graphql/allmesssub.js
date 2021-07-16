import { gql } from '@apollo/client';

export const AllMessage_Sub = gql`
  subscription {
    allmessage {
        mutation
        data {
            body
            sender{
              name
            }             
        }
    }
  }
`;
