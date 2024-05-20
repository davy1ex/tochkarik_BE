export default function Post({num_post = 0, title = 'Same title', body_prev}) {
    return (
        <div className={`post_${num_post.toString()}`}>
            {title}
            <br/>
            <hr/>

            {body_prev}
        </div>
    )
}


