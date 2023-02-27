import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import { useEffect, useState } from 'react';

// const DUMMY_MEALS = [
//   {
//     id: 'm1',
//     name: 'Burger',
//     description: 'Finest fish and veggies',
//     price: 2.9,
//   },
//   {
//     id: 'm2',
//     name: 'Sandwich',
//     description: 'A german specialty!',
//     price: 5.5,
//   },
//   {
//     id: 'm3',
//     name: 'Coffee',
//     description: 'American, raw, meaty',
//     price: 12.99,
//   },
//   {
//     id: 'm4',
//     name: 'Green Tea',
//     description: 'Healthy...and green...',
//     price: 8.99,
//   },
// ];


const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState()

  useEffect(() => {
    // setIsLoading(true);
    const fetchMeals = async () => {
    const response = await fetch('https://react-http-dd11f-default-rtdb.firebaseio.com/meals.json');
    const responseData = await response.json();

    if(!response.ok) {
      throw new Error('Something went wrong');
    }

      const loadedMeals = [];
      for(const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    }

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    )
  }

  if(httpError) {
    return(
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    )
  }

  const mealsList = meals.map((meals) => (
    <MealItem
      key={meals.id}
      id={meals.id}
      name={meals.name}
      description={meals.description}
      price={meals.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;