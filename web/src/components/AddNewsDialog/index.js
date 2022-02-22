import { useState } from "react";
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'

const CREATE_NEWS_MUTATION = gql`
  mutation CreateNewsMutation($input: CreateNewsItemInput!) {
    createNewsItem(input: $input) {
      id
      title
      body
      writtenBy
      imageUrl
    }
  }
`

export default function AddNewsDialog({ closeModal }) {
  const [createNewsItem, { loading, error }] = useMutation(
    CREATE_NEWS_MUTATION,
    {
      onCompleted: () => {
        toast.success('News item created')
        window.location.reload()
      },
    }
  )

  const [disable, setDisable] = useState(false);

  async function saveNews() {
    const title = window.newsTitle.value;
    const imageUrl = window.newsImageUrl.value;
    const writtenBy = window.newsWrittenBy.value;
    const body = window.newsBody.value;

    createNewsItem({
      variables: {
        input: {
          title,
          imageUrl,
          writtenBy,
          body
        }
      }
    })

    setDisable(true);
    //window.location.reload();
    setDisable(false);
  }

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add News</h3>
          <span
            style={{ padding: "10px", cursor: "pointer" }}
            onClick={closeModal}
          >
            X
          </span>
        </div>
        <div className="modal-body content">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div className="inputField">
              <div className="label">
                <label>Title</label>
              </div>
              <div>
                <input id="newsTitle" type="text" />
              </div>
            </div>
            <div className="inputField">
              <div className="label">
                <label>ImageUrl</label>
              </div>
              <div>
                <input id="newsImageUrl" type="text" />
              </div>
            </div>
            <div className="inputField">
              <div className="label">
                <label>Written By</label>
              </div>
              <div>
                <input id="newsWrittenBy" type="text" />
              </div>
            </div>
            <div className="inputField" style={{ flex: "2 1 100%" }}>
              <div className="label">
                <label>Body</label>
              </div>
              <div>
                <textarea
                  id="newsBody"
                  style={{ width: "100%", height: "200px" }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            disabled={loading}
            className="btn-danger"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button disabled={loading} className="btn" onClick={saveNews}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
