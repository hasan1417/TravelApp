import { submitForm } from './js/app'

// Importing SASS files.
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/styles.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/header.scss'
import './styles/resets.scss'

// It is required in this project to use .addEventListener() and here is the appropriate place.
document.querySelector('#submit').addEventListener('click', submitForm);

export {
	submitForm
}
