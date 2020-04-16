import React, { Component } from 'react'

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

class CreateLink extends Component {
    state = {
        description: '',
        url: '',
    }

    render() {
        const { description, url } = this.state
        return (
            <div>
                <div className="flex flex-column mt3">
                    <input
                        className="form-control mb-2"
                        value={description}
                        onChange={e => this.setState({ description: e.target.value })}
                        type="text"
                        placeholder="A description for the link"
                    />
                    <input
                        className="form-control mb-2"
                        value={url}
                        onChange={e => this.setState({ url: e.target.value })}
                        type="text"
                        placeholder="The URL for the link"
                    />
                </div>
                <Mutation
                    mutation={POST_MUTATION}
                    variables={{ description, url }}
                    onCompleted={() => this.props.history.push('/new/1')}
                    update={(store, { data: { post } }) => {
                        const first = LINKS_PER_PAGE
                        const skip = 0
                        const orderBy = 'createdAt_DESC'
                        const data = store.readQuery({
                            query: FEED_QUERY,
                            variables: { first, skip, orderBy }
                        })
                        data.feed.links.unshift(post)
                        store.writeQuery({
                            query: FEED_QUERY,
                            data,
                            variables: { first, skip, orderBy }
                        })
                    }}
                >
                    {postMutation => <button className="pointer mr2 btn btn-outline-primary btn-sm"
                                             onClick={postMutation}>Submit</button>}
                </Mutation>
            </div>
        )
    }
}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {   
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
    }
  }
`;

export default CreateLink;