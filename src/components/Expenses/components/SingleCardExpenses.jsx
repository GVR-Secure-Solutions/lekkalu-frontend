import styles from './SingleCardExpenses.module.css'
export default function SingleCardExpenses({budgets}){
    return(
        <div className={styles.container}>
            <div className={styles.containerTitle}>
                <span>Budgets</span>
                <button>+</button>
            </div>
            <ul className={styles.containerLi}>
                {
                    budgets.map((data)=>(
                    <li key={data.id}>
                        <span>{data.month}</span>
                        <span>{data.limit}</span>
                    </li>
                    ))
                }
            </ul>
        </div>
    )
}