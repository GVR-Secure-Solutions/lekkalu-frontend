import styles from './styles/FeedbackButton.module.css'

export default function FeedbackButton (){
    const handleClick=()=>{
        const popUp=document.querySelector('#popUpSupport')
        const blurBackground = document.querySelector('#blurBackground')
        popUp.style.display='flex'
        blurBackground.style.display='flex'
    }
    
    return(
        <>
            <button className={styles.button} onClick={handleClick}>Leave your feedback</button>
        </>
    )
}