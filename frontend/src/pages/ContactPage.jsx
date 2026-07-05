import '../themes/ContactPage.css'
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className='contact-page'>
                <a href="#" onClick={() => navigate(-1)} className='return-btn'>⬅ Return</a>
                <div className='contact-page-main'>
                    <iframe
                        src="https://forms.gle/foW6K8GFceYfNVhK7"
                        title='Contact Form'
                        width="100%"
                        height="1300"
                        style={{ border: 'none' }} />
                </div>
                <div className="contact-grid">
                    <div className="card phone">
                        <img src="/PhoneIcon.png" /> <br />
                        Phone Number
                        <p>
                            012-3456-7890 <br />
                            880-1234-4677 (Toll free)
                        </p>
                    </div>

                    <div className="card office">
                        <img src="/OFIcon.png" /> <br />
                        Main Office
                        <p>
                            Example 36 RauMa St <br />
                            Hoa Thanh, HT 3636
                        </p>
                    </div>

                    <div className="card email">
                        <img src="/EmailIcon.png" /> <br />
                        Email
                        <p>
                            Hotmail@gmail.com
                        </p>
                    </div>
                    <div className="card github">
                        <img src="/GithubIcon.png" /> <br />
                        Github
                        <br />
                        <a href="https://github.com/OAC-Team">
                            https://github.com/OAC-Team
                        </a>
                    </div>
                    <p>㋑ Develop by OAC Team</p>
                </div>
            </div>
        </>
    )
}