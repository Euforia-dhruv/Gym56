"use client";

import { ReactNode, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Apple, Beef, Milk, Wheat, Brain,
  Flame, Heart, Droplet,
  Sun, Moon, Zap, Clock, ChevronRight,
  Salad, Soup, Coffee, Cake, Trash2,
  Award, X,
} from "lucide-react";

interface Food {
  name: string; serving: string; cal: number; protein: number; carbs: number; fat: number; fiber: number;
  type: "veg" | "nonveg" | "vegan"; meal: string[]; category: string;
}
interface Recipe {
  name: string; time: string; cal: number; protein: number; difficulty: string;
  type: "veg" | "nonveg" | "vegan"; meal: string; ingredients: string[]; instructions: string[];
}

const FOODS: Food[] = [
  { name: "Chapati (Whole Wheat)", serving: "1 medium (40g)", cal: 120, protein: 3.5, carbs: 24, fat: 1.5, fiber: 4, type: "veg", meal: ["breakfast", "lunch", "dinner"], category: "grains" },
  { name: "White Rice (Cooked)", serving: "1 cup (200g)", cal: 260, protein: 4.5, carbs: 58, fat: 0.5, fiber: 1, type: "veg", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Brown Rice (Cooked)", serving: "1 cup (200g)", cal: 220, protein: 5, carbs: 46, fat: 1.5, fiber: 3.5, type: "veg", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Basmati Rice (Cooked)", serving: "1 cup (200g)", cal: 250, protein: 4, carbs: 56, fat: 0.5, fiber: 1, type: "veg", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Dal (Moong Dal Cooked)", serving: "1 cup (200g)", cal: 180, protein: 12, carbs: 28, fat: 2, fiber: 6, type: "veg", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Dal (Masoor Dal)", serving: "1 cup (200g)", cal: 190, protein: 13, carbs: 30, fat: 1.5, fiber: 7, type: "veg", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Dal (Toor Dal)", serving: "1 cup (200g)", cal: 200, protein: 11, carbs: 32, fat: 2, fiber: 6, type: "veg", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Dal (Chana Dal)", serving: "1 cup (200g)", cal: 220, protein: 14, carbs: 35, fat: 1, fiber: 8, type: "veg", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Chickpeas (Chole)", serving: "1 cup (200g)", cal: 270, protein: 14.5, carbs: 45, fat: 4, fiber: 12, type: "veg", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Rajma (Kidney Beans)", serving: "1 cup (200g)", cal: 250, protein: 15, carbs: 40, fat: 2, fiber: 11, type: "veg", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Soybean (Soya Chunks)", serving: "1 cup (100g)", cal: 345, protein: 52, carbs: 33, fat: 0.5, fiber: 13, type: "vegan", meal: ["lunch", "dinner"], category: "legumes" },
  { name: "Tofu (Paneer replacement)", serving: "100g", cal: 76, protein: 8, carbs: 2, fat: 4, fiber: 1, type: "vegan", meal: ["breakfast", "lunch", "dinner"], category: "protein" },
  { name: "Chicken Breast (Grilled)", serving: "100g", cal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Chicken Thigh (Skinless)", serving: "100g", cal: 210, protein: 26, carbs: 0, fat: 11, fiber: 0, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Egg (Whole)", serving: "1 large (50g)", cal: 72, protein: 6.3, carbs: 0.6, fat: 5, fiber: 0, type: "nonveg", meal: ["breakfast"], category: "protein" },
  { name: "Egg White", serving: "1 large (33g)", cal: 17, protein: 3.6, carbs: 0.2, fat: 0, fiber: 0, type: "nonveg", meal: ["breakfast"], category: "protein" },
  { name: "Fish (Rohu)", serving: "100g", cal: 110, protein: 19, carbs: 0, fat: 3, fiber: 0, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Fish (Pomfret)", serving: "100g", cal: 120, protein: 20, carbs: 0, fat: 4, fiber: 0, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Prawns", serving: "100g", cal: 85, protein: 18, carbs: 1, fat: 0.5, fiber: 0, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Mutton (Goat)", serving: "100g", cal: 200, protein: 25, carbs: 0, fat: 11, fiber: 0, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Paneer (Cottage Cheese)", serving: "100g", cal: 265, protein: 18, carbs: 3, fat: 21, fiber: 0, type: "veg", meal: ["breakfast", "lunch", "dinner"], category: "protein" },
  { name: "Greek Yogurt (Dahi)", serving: "1 cup (200g)", cal: 130, protein: 20, carbs: 7, fat: 2, fiber: 0, type: "veg", meal: ["breakfast", "snack"], category: "protein" },
  { name: "Curd (Regular)", serving: "1 cup (200g)", cal: 120, protein: 8, carbs: 9, fat: 6, fiber: 0, type: "veg", meal: ["lunch", "dinner", "snack"], category: "protein" },
  { name: "Milk (Buffalo)", serving: "1 cup (250ml)", cal: 200, protein: 9, carbs: 10, fat: 14, fiber: 0, type: "veg", meal: ["breakfast", "snack"], category: "dairy" },
  { name: "Milk (Cow)", serving: "1 cup (250ml)", cal: 150, protein: 8, carbs: 12, fat: 8, fiber: 0, type: "veg", meal: ["breakfast", "snack"], category: "dairy" },
  { name: "Soy Milk", serving: "1 cup (250ml)", cal: 105, protein: 8, carbs: 9, fat: 4, fiber: 1, type: "vegan", meal: ["breakfast", "snack"], category: "dairy" },
  { name: "Ghee", serving: "1 tbsp (15ml)", cal: 135, protein: 0, carbs: 0, fat: 15, fiber: 0, type: "veg", meal: [], category: "fats" },
  { name: "Butter (Salted)", serving: "1 tbsp (14g)", cal: 102, protein: 0.1, carbs: 0, fat: 11.5, fiber: 0, type: "veg", meal: [], category: "fats" },
  { name: "Almonds (Badam)", serving: "10 pieces (15g)", cal: 105, protein: 3.5, carbs: 3, fat: 9, fiber: 2, type: "vegan", meal: ["snack"], category: "nuts" },
  { name: "Cashews (Kaju)", serving: "10 pieces (15g)", cal: 85, protein: 2.5, carbs: 4, fat: 7, fiber: 1, type: "vegan", meal: ["snack"], category: "nuts" },
  { name: "Walnuts (Akhrot)", serving: "3 pieces (15g)", cal: 100, protein: 2.5, carbs: 2, fat: 10, fiber: 1.5, type: "vegan", meal: ["snack"], category: "nuts" },
  { name: "Peanuts (Moongphali)", serving: "30g", cal: 170, protein: 7, carbs: 6, fat: 14, fiber: 2.5, type: "vegan", meal: ["snack"], category: "nuts" },
  { name: "Pistachios (Pista)", serving: "15g", cal: 85, protein: 3, carbs: 4, fat: 7, fiber: 1.5, type: "vegan", meal: ["snack"], category: "nuts" },
  { name: "Banana", serving: "1 medium (100g)", cal: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3, type: "vegan", meal: ["breakfast", "snack", "pre"], category: "fruits" },
  { name: "Apple", serving: "1 medium (180g)", cal: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.5, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Orange", serving: "1 medium (150g)", cal: 65, protein: 1.3, carbs: 16, fat: 0.2, fiber: 3, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Mango (Alphonso)", serving: "1 medium (200g)", cal: 120, protein: 1, carbs: 30, fat: 0.5, fiber: 2.5, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Papaya", serving: "1 cup (150g)", cal: 55, protein: 0.9, carbs: 14, fat: 0.2, fiber: 2.5, type: "vegan", meal: ["breakfast", "snack"], category: "fruits" },
  { name: "Watermelon", serving: "1 cup (150g)", cal: 45, protein: 0.9, carbs: 11, fat: 0.2, fiber: 0.5, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Dates (Khajoor)", serving: "2 pieces (20g)", cal: 55, protein: 0.5, carbs: 15, fat: 0, fiber: 1.5, type: "vegan", meal: ["snack", "pre"], category: "fruits" },
  { name: "Potato (Boiled)", serving: "1 medium (150g)", cal: 115, protein: 3, carbs: 26, fat: 0.2, fiber: 2, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Sweet Potato", serving: "1 medium (150g)", cal: 130, protein: 2.5, carbs: 30, fat: 0.2, fiber: 4, type: "vegan", meal: ["lunch", "dinner", "pre"], category: "vegetables" },
  { name: "Spinach (Palak)", serving: "1 cup (30g)", cal: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Broccoli", serving: "1 cup (90g)", cal: 30, protein: 2.5, carbs: 6, fat: 0.3, fiber: 2.5, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Cauliflower (Gobi)", serving: "1 cup (100g)", cal: 25, protein: 2, carbs: 5, fat: 0.1, fiber: 2, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Green Peas (Matar)", serving: "1 cup (150g)", cal: 120, protein: 8, carbs: 20, fat: 0.5, fiber: 6, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Cucumber (Kheera)", serving: "1 cup (100g)", cal: 15, protein: 0.6, carbs: 3.5, fat: 0.1, fiber: 1, type: "vegan", meal: ["snack"], category: "vegetables" },
  { name: "Tomato", serving: "1 medium (100g)", cal: 18, protein: 0.9, carbs: 4, fat: 0.2, fiber: 1.2, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Onion", serving: "1 medium (100g)", cal: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.5, type: "vegan", meal: [], category: "vegetables" },
  { name: "Oats (Rolled)", serving: "50g (dry)", cal: 190, protein: 6.5, carbs: 33, fat: 3, fiber: 5, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Cereal (Muesli)", serving: "50g", cal: 175, protein: 4, carbs: 33, fat: 2.5, fiber: 4, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Poha (Flaked Rice)", serving: "1 cup (150g)", cal: 180, protein: 3.5, carbs: 38, fat: 2, fiber: 2, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Upma (Semolina)", serving: "1 cup (200g)", cal: 220, protein: 5, carbs: 40, fat: 5, fiber: 3, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Paratha (Aloo)", serving: "1 medium", cal: 260, protein: 5, carbs: 35, fat: 11, fiber: 3, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Dosa (Plain)", serving: "1 medium", cal: 120, protein: 2.5, carbs: 22, fat: 2, fiber: 1, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Idli", serving: "2 pieces", cal: 140, protein: 4, carbs: 28, fat: 1, fiber: 2, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Bread (Brown/Whole Wheat)", serving: "1 slice (30g)", cal: 75, protein: 3, carbs: 13, fat: 1, fiber: 2, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Bread (White)", serving: "1 slice (30g)", cal: 80, protein: 2.5, carbs: 15, fat: 0.5, fiber: 0.5, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Whey Protein (Isolate)", serving: "1 scoop (30g)", cal: 115, protein: 25, carbs: 2, fat: 0.5, fiber: 0, type: "vegan", meal: ["post", "snack"], category: "supplements" },
  { name: "Whey Protein (Concentrate)", serving: "1 scoop (30g)", cal: 120, protein: 24, carbs: 3, fat: 1.5, fiber: 0, type: "veg", meal: ["post", "snack"], category: "supplements" },
  { name: "Peanut Butter (Natural)", serving: "1 tbsp (16g)", cal: 95, protein: 4, carbs: 3, fat: 8, fiber: 1, type: "vegan", meal: ["breakfast", "snack"], category: "fats" },
  { name: "Chia Seeds", serving: "1 tbsp (15g)", cal: 70, protein: 2.5, carbs: 6, fat: 4.5, fiber: 5, type: "vegan", meal: ["breakfast", "snack"], category: "seeds" },
  { name: "Flax Seeds (Alsi)", serving: "1 tbsp (10g)", cal: 55, protein: 2, carbs: 3, fat: 4, fiber: 3, type: "vegan", meal: ["breakfast", "snack"], category: "seeds" },
  { name: "Pumpkin Seeds (Pepita)", serving: "1 tbsp (15g)", cal: 80, protein: 3.5, carbs: 2, fat: 7, fiber: 1.5, type: "vegan", meal: ["snack"], category: "seeds" },
  { name: "Sunflower Seeds", serving: "1 tbsp (15g)", cal: 85, protein: 3, carbs: 3, fat: 7, fiber: 1.5, type: "vegan", meal: ["snack"], category: "seeds" },
  { name: "Coconut (Fresh)", serving: "1 cup (80g)", cal: 280, protein: 2.5, carbs: 12, fat: 26, fiber: 7, type: "vegan", meal: [], category: "fats" },
  { name: "Coconut Oil", serving: "1 tbsp (15ml)", cal: 130, protein: 0, carbs: 0, fat: 13.5, fiber: 0, type: "vegan", meal: [], category: "fats" },
  { name: "Olive Oil", serving: "1 tbsp (15ml)", cal: 120, protein: 0, carbs: 0, fat: 13.5, fiber: 0, type: "vegan", meal: [], category: "fats" },
  { name: "Mustard Oil", serving: "1 tbsp (15ml)", cal: 130, protein: 0, carbs: 0, fat: 14, fiber: 0, type: "vegan", meal: [], category: "fats" },
  { name: "Honey", serving: "1 tbsp (20g)", cal: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, type: "vegan", meal: ["snack"], category: "sweeteners" },
  { name: "Jaggery (Gur)", serving: "1 tbsp (15g)", cal: 57, protein: 0, carbs: 14, fat: 0, fiber: 0.5, type: "vegan", meal: [], category: "sweeteners" },
  { name: "Sugar (White)", serving: "1 tsp (5g)", cal: 20, protein: 0, carbs: 5, fat: 0, fiber: 0, type: "vegan", meal: [], category: "sweeteners" },
  { name: "Green Gram Sprouts", serving: "1 cup (150g)", cal: 100, protein: 8, carbs: 16, fat: 0.5, fiber: 5, type: "vegan", meal: ["breakfast", "snack"], category: "legumes" },
  { name: "Lassi (Sweet)", serving: "1 glass (250ml)", cal: 160, protein: 5, carbs: 20, fat: 7, fiber: 0, type: "veg", meal: ["snack"], category: "dairy" },
  { name: "Buttermilk (Chaas)", serving: "1 glass (250ml)", cal: 65, protein: 3, carbs: 7, fat: 3, fiber: 0, type: "veg", meal: ["snack"], category: "dairy" },
  { name: "Samosa (Fried)", serving: "1 piece", cal: 180, protein: 4, carbs: 22, fat: 9, fiber: 1.5, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Vada Pav", serving: "1 piece", cal: 250, protein: 5, carbs: 30, fat: 12, fiber: 2, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Dhokla (Khaman)", serving: "2 pieces (100g)", cal: 120, protein: 4, carbs: 20, fat: 3, fiber: 2, type: "veg", meal: ["breakfast", "snack"], category: "snacks" },
  { name: "Chicken Curry (with gravy)", serving: "1 cup (200g)", cal: 280, protein: 28, carbs: 6, fat: 16, fiber: 1, type: "nonveg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Palak Paneer", serving: "1 cup (200g)", cal: 240, protein: 14, carbs: 8, fat: 18, fiber: 3, type: "veg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Dal Makhani", serving: "1 cup (200g)", cal: 300, protein: 12, carbs: 34, fat: 13, fiber: 8, type: "veg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Chana Masala", serving: "1 cup (200g)", cal: 250, protein: 10, carbs: 36, fat: 8, fiber: 10, type: "veg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Chicken Biryani", serving: "1 plate (300g)", cal: 420, protein: 25, carbs: 50, fat: 14, fiber: 2, type: "nonveg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Veg Biryani", serving: "1 plate (300g)", cal: 350, protein: 8, carbs: 55, fat: 11, fiber: 4, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Egg Curry", serving: "1 cup (2 eggs + gravy)", cal: 250, protein: 16, carbs: 6, fat: 18, fiber: 1, type: "nonveg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Fish Curry", serving: "1 cup (200g)", cal: 200, protein: 22, carbs: 4, fat: 11, fiber: 1, type: "nonveg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Roti (Millets/Bajra)", serving: "1 medium (40g)", cal: 110, protein: 3, carbs: 22, fat: 1.5, fiber: 3, type: "vegan", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Roti (Jowar/Sorghum)", serving: "1 medium (40g)", cal: 105, protein: 3.5, carbs: 22, fat: 1, fiber: 3.5, type: "vegan", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Bajra Roti (Pearl Millet)", serving: "1 medium (40g)", cal: 115, protein: 3, carbs: 23, fat: 2, fiber: 3, type: "vegan", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Khichdi (Rice+Moong Dal)", serving: "1 plate (300g)", cal: 280, protein: 12, carbs: 48, fat: 4, fiber: 5, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Pulao (Veg)", serving: "1 plate (250g)", cal: 300, protein: 6, carbs: 52, fat: 7, fiber: 3, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Naan (Butter)", serving: "1 piece", cal: 200, protein: 5, carbs: 32, fat: 6, fiber: 1, type: "veg", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Kheer (Rice Pudding)", serving: "1 cup (200g)", cal: 280, protein: 7, carbs: 42, fat: 10, fiber: 0.5, type: "veg", meal: ["snack"], category: "desserts" },
  { name: "Gulab Jamun", serving: "2 pieces", cal: 300, protein: 3, carbs: 45, fat: 13, fiber: 0.5, type: "veg", meal: ["snack"], category: "desserts" },
  { name: "Rasgulla", serving: "2 pieces", cal: 140, protein: 4, carbs: 28, fat: 2, fiber: 0, type: "veg", meal: ["snack"], category: "desserts" },
  { name: "Coconut Water", serving: "1 glass (250ml)", cal: 45, protein: 0.5, carbs: 9, fat: 0, fiber: 0, type: "vegan", meal: ["snack"], category: "beverages" },
  { name: "Green Tea", serving: "1 cup (250ml)", cal: 2, protein: 0, carbs: 0.5, fat: 0, fiber: 0, type: "vegan", meal: ["snack"], category: "beverages" },
  { name: "Coffee (Black)", serving: "1 cup (250ml)", cal: 5, protein: 0.3, carbs: 0, fat: 0, fiber: 0, type: "vegan", meal: ["snack"], category: "beverages" },
  { name: "Chai (Tea with Milk + Sugar)", serving: "1 cup (200ml)", cal: 75, protein: 1.5, carbs: 10, fat: 3.5, fiber: 0, type: "veg", meal: ["snack"], category: "beverages" },
  { name: "Protein Bar (Store-bought)", serving: "1 bar (60g)", cal: 220, protein: 18, carbs: 25, fat: 7, fiber: 3, type: "veg", meal: ["snack", "post"], category: "supplements" },
  { name: "Pasta (Whole Wheat)", serving: "100g (dry)", cal: 350, protein: 13, carbs: 68, fat: 2.5, fiber: 8, type: "vegan", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Oats Upma", serving: "1 plate (200g)", cal: 210, protein: 7, carbs: 34, fat: 5, fiber: 5, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Moong Dal Chilla (Cheela)", serving: "2 pieces", cal: 180, protein: 10, carbs: 22, fat: 6, fiber: 4, type: "veg", meal: ["breakfast"], category: "protein" },
  { name: "Besan Chilla (Gram flour pancake)", serving: "2 pieces", cal: 160, protein: 8, carbs: 18, fat: 7, fiber: 3, type: "veg", meal: ["breakfast"], category: "protein" },
  { name: "Avocado", serving: "1/2 medium (75g)", cal: 120, protein: 1.5, carbs: 6, fat: 11, fiber: 5, type: "vegan", meal: ["breakfast", "snack"], category: "fruits" },
  { name: "Pomegranate (Anar)", serving: "1/2 cup (90g)", cal: 55, protein: 1, carbs: 14, fat: 0.2, fiber: 2.5, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Guava (Amrood)", serving: "1 medium (100g)", cal: 68, protein: 2.5, carbs: 14, fat: 1, fiber: 5.5, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Tendli (Ivy Gourd)", serving: "1 cup (100g)", cal: 20, protein: 1, carbs: 4, fat: 0.2, fiber: 1.5, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Bitter Gourd (Karela)", serving: "1 cup (100g)", cal: 15, protein: 1, carbs: 3, fat: 0.2, fiber: 2, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Bottle Gourd (Lauki)", serving: "1 cup (100g)", cal: 14, protein: 0.6, carbs: 3, fat: 0.1, fiber: 1, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Ridge Gourd (Turai)", serving: "1 cup (100g)", cal: 18, protein: 0.5, carbs: 4, fat: 0.2, fiber: 1.5, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Drumstick (Moringa)", serving: "1 cup (100g)", cal: 37, protein: 2, carbs: 8, fat: 0.2, fiber: 3, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Jackfruit Seed", serving: "1/4 cup (50g)", cal: 70, protein: 3, carbs: 13, fat: 0.5, fiber: 2, type: "vegan", meal: ["snack"], category: "vegetables" },
  { name: "Mushroom (Button)", serving: "1 cup (100g)", cal: 22, protein: 3, carbs: 3, fat: 0.3, fiber: 1, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Capsicum (Shimla Mirch)", serving: "1 medium (100g)", cal: 26, protein: 1, carbs: 6, fat: 0.3, fiber: 2, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Raw Banana (Kacha Kela)", serving: "1 medium (100g)", cal: 105, protein: 1.2, carbs: 27, fat: 0.3, fiber: 2, type: "vegan", meal: ["snack", "lunch"], category: "vegetables" },
  { name: "Tapioca (Sabudana)", serving: "1/4 cup (45g)", cal: 160, protein: 0.2, carbs: 38, fat: 0.1, fiber: 0.5, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Sabudana Khichdi", serving: "1 plate (200g)", cal: 250, protein: 3, carbs: 48, fat: 5, fiber: 1, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Paneer Bhurji", serving: "1 cup (200g)", cal: 280, protein: 22, carbs: 5, fat: 20, fiber: 1, type: "veg", meal: ["breakfast"], category: "protein" },
  { name: "Scrambled Eggs", serving: "2 eggs (100g)", cal: 165, protein: 16, carbs: 2, fat: 10, fiber: 0, type: "nonveg", meal: ["breakfast"], category: "protein" },
  { name: "Omelette (2 eggs)", serving: "2 eggs", cal: 180, protein: 16, carbs: 2, fat: 12, fiber: 0, type: "nonveg", meal: ["breakfast"], category: "protein" },
  { name: "Chicken Salad", serving: "1 plate (250g)", cal: 220, protein: 30, carbs: 8, fat: 8, fiber: 3, type: "nonveg", meal: ["lunch", "dinner"], category: "salads" },
  { name: "Sprouts Salad", serving: "1 plate (200g)", cal: 120, protein: 9, carbs: 18, fat: 1, fiber: 6, type: "vegan", meal: ["breakfast", "snack"], category: "salads" },
  { name: "Fruit Salad", serving: "1 bowl (200g)", cal: 90, protein: 1.5, carbs: 22, fat: 0.5, fiber: 3.5, type: "vegan", meal: ["snack"], category: "salads" },
  { name: "Curd Rice", serving: "1 plate (250g)", cal: 210, protein: 7, carbs: 35, fat: 5, fiber: 0.5, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Lemon Rice (Chitranna)", serving: "1 plate (250g)", cal: 270, protein: 5, carbs: 52, fat: 5, fiber: 1, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Coconut Rice", serving: "1 plate (250g)", cal: 310, protein: 5, carbs: 48, fat: 11, fiber: 2, type: "vegan", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Tamarind Rice (Puliyogare)", serving: "1 plate (250g)", cal: 280, protein: 5, carbs: 50, fat: 7, fiber: 1.5, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Ragi (Finger Millet) Porridge", serving: "1 cup (200g)", cal: 180, protein: 4, carbs: 36, fat: 2, fiber: 5, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Ragi Dosa", serving: "2 pieces", cal: 130, protein: 3, carbs: 24, fat: 2, fiber: 3, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Ragi Malt (Health Drink)", serving: "1 glass (250ml)", cal: 160, protein: 4, carbs: 30, fat: 3, fiber: 3, type: "veg", meal: ["breakfast", "snack"], category: "beverages" },
  { name: "Sattu (Roasted Gram) Drink", serving: "1 glass (250ml)", cal: 130, protein: 8, carbs: 22, fat: 1, fiber: 4, type: "vegan", meal: ["breakfast", "snack"], category: "beverages" },
  { name: "Lassi (Salted)", serving: "1 glass (250ml)", cal: 120, protein: 5, carbs: 12, fat: 6, fiber: 0, type: "veg", meal: ["snack"], category: "beverages" },
  { name: "Shrikhand", serving: "1 cup (200g)", cal: 280, protein: 8, carbs: 42, fat: 11, fiber: 0, type: "veg", meal: ["snack"], category: "desserts" },
  { name: "Aamras (Mango Pulp)", serving: "1 cup (200g)", cal: 140, protein: 1, carbs: 34, fat: 0.5, fiber: 2, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Kaju Katli", serving: "2 pieces (30g)", cal: 140, protein: 2, carbs: 16, fat: 8, fiber: 1, type: "veg", meal: ["snack"], category: "desserts" },
  { name: "Seviyan (Vermicelli Kheer)", serving: "1 cup (200g)", cal: 240, protein: 6, carbs: 38, fat: 8, fiber: 1, type: "veg", meal: ["snack"], category: "desserts" },
  { name: "Custard Apple (Sitaphal)", serving: "1 medium (150g)", cal: 100, protein: 1.5, carbs: 24, fat: 0.5, fiber: 3, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Tender Coconut", serving: "1 whole", cal: 45, protein: 1, carbs: 8, fat: 1.5, fiber: 2, type: "vegan", meal: ["snack"], category: "beverages" },
  { name: "Basil Seeds (Sabja/Tukmaria)", serving: "1 tbsp (10g)", cal: 35, protein: 1.5, carbs: 6, fat: 0.5, fiber: 4, type: "vegan", meal: ["snack"], category: "seeds" },
  { name: "Quinoa (Cooked)", serving: "1 cup (200g)", cal: 220, protein: 8, carbs: 39, fat: 3.5, fiber: 5, type: "vegan", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Couscous (Cooked)", serving: "1 cup (200g)", cal: 210, protein: 6, carbs: 42, fat: 0.5, fiber: 3, type: "vegan", meal: ["lunch", "dinner"], category: "grains" },
  { name: "Methi (Fenugreek Leaves)", serving: "1 cup (30g)", cal: 8, protein: 0.5, carbs: 1.5, fat: 0.2, fiber: 1, type: "vegan", meal: ["lunch", "dinner"], category: "vegetables" },
  { name: "Karela Juice (Bitter Gourd)", serving: "1 glass (100ml)", cal: 20, protein: 0.5, carbs: 4, fat: 0, fiber: 0, type: "vegan", meal: ["snack"], category: "beverages" },
  { name: "Wheatgrass Juice", serving: "1 shot (30ml)", cal: 10, protein: 0.5, carbs: 2, fat: 0, fiber: 0.5, type: "vegan", meal: ["snack"], category: "beverages" },
  { name: "Amla (Indian Gooseberry)", serving: "1 piece (30g)", cal: 15, protein: 0.3, carbs: 3.5, fat: 0.1, fiber: 1.5, type: "vegan", meal: ["snack"], category: "fruits" },
  { name: "Masala Oats (Instant)", serving: "1 packet (50g)", cal: 190, protein: 5, carbs: 32, fat: 5, fiber: 4, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Thepla (Gujarati Flatbread)", serving: "1 piece", cal: 140, protein: 3.5, carbs: 20, fat: 5, fiber: 3, type: "veg", meal: ["breakfast", "snack"], category: "grains" },
  { name: "Handvo (Savory Lentil Cake)", serving: "1 piece (100g)", cal: 170, protein: 6, carbs: 24, fat: 6, fiber: 4, type: "veg", meal: ["breakfast", "snack"], category: "snacks" },
  { name: "Khandvi (Gujarati Snack)", serving: "6 pieces (100g)", cal: 130, protein: 4, carbs: 14, fat: 7, fiber: 1, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Muthiya (Steamed Dumplings)", serving: "4 pieces (100g)", cal: 160, protein: 4, carbs: 24, fat: 6, fiber: 5, type: "veg", meal: ["breakfast", "snack"], category: "snacks" },
  { name: "Fafda (Gram Flour Crisps)", serving: "6 pieces (50g)", cal: 200, protein: 5, carbs: 22, fat: 11, fiber: 2, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Chivda (Poha Mixture)", serving: "1/2 cup (30g)", cal: 130, protein: 3, carbs: 18, fat: 6, fiber: 1.5, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Roasted Makhana (Fox Nuts)", serving: "1 cup (30g)", cal: 120, protein: 4, carbs: 22, fat: 2, fiber: 5, type: "vegan", meal: ["snack"], category: "snacks" },
  { name: "Khakhra (Gujarati Crispbread)", serving: "2 pieces (30g)", cal: 110, protein: 3, carbs: 16, fat: 4, fiber: 2, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Murmura (Puffed Rice)", serving: "1 cup (30g)", cal: 110, protein: 2, carbs: 24, fat: 0.5, fiber: 1, type: "vegan", meal: ["snack"], category: "snacks" },
  { name: "Bhel Puri", serving: "1 plate (200g)", cal: 200, protein: 4, carbs: 34, fat: 6, fiber: 3, type: "veg", meal: ["snack"], category: "snacks" },
  { name: "Pav Bhaji", serving: "1 plate (2 pav + bhaji)", cal: 380, protein: 8, carbs: 52, fat: 16, fiber: 5, type: "veg", meal: ["lunch", "dinner"], category: "snacks" },
  { name: "Misal Pav", serving: "1 plate", cal: 350, protein: 12, carbs: 42, fat: 15, fiber: 8, type: "veg", meal: ["breakfast", "snack"], category: "snacks" },
  { name: "Masala Dosa", serving: "1 piece", cal: 250, protein: 5, carbs: 38, fat: 9, fiber: 2, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Rava Dosa", serving: "1 piece", cal: 140, protein: 3, carbs: 24, fat: 3, fiber: 1, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Uttapam (Thick Dosa)", serving: "1 piece", cal: 180, protein: 5, carbs: 28, fat: 5, fiber: 2, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Vangi Bath (Eggplant Rice)", serving: "1 plate (250g)", cal: 290, protein: 5, carbs: 50, fat: 8, fiber: 3, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Bisi Bele Bath", serving: "1 plate (300g)", cal: 320, protein: 10, carbs: 52, fat: 8, fiber: 5, type: "veg", meal: ["lunch", "dinner"], category: "rice_dishes" },
  { name: "Pongal (Ven Pongal)", serving: "1 plate (250g)", cal: 280, protein: 8, carbs: 45, fat: 8, fiber: 3, type: "veg", meal: ["breakfast"], category: "grains" },
  { name: "Appam (Rice Pancake)", serving: "2 pieces", cal: 180, protein: 3, carbs: 34, fat: 3, fiber: 1, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Idiyappam (String Hoppers)", serving: "2 pieces", cal: 140, protein: 2, carbs: 28, fat: 2, fiber: 1, type: "vegan", meal: ["breakfast"], category: "grains" },
  { name: "Putu Mayam (Rice Noodles)", serving: "1 portion", cal: 150, protein: 2, carbs: 32, fat: 1.5, fiber: 0.5, type: "vegan", meal: ["breakfast", "snack"], category: "grains" },
  { name: "Chicken 65 (Dry)", serving: "1 portion (150g)", cal: 320, protein: 28, carbs: 10, fat: 20, fiber: 1, type: "nonveg", meal: ["snack"], category: "protein" },
  { name: "Tandoori Chicken", serving: "2 pieces (200g)", cal: 250, protein: 30, carbs: 4, fat: 13, fiber: 0.5, type: "nonveg", meal: ["lunch", "dinner"], category: "protein" },
  { name: "Chicken Tikka (Grilled)", serving: "6 pieces (150g)", cal: 210, protein: 27, carbs: 3, fat: 10, fiber: 0.5, type: "nonveg", meal: ["snack", "dinner"], category: "protein" },
  { name: "Fish Tikli (Patties)", serving: "2 pieces (100g)", cal: 170, protein: 14, carbs: 12, fat: 8, fiber: 1, type: "nonveg", meal: ["snack"], category: "snacks" },
  { name: "Egg Bhurji (Indian Scramble)", serving: "2 eggs (100g)", cal: 190, protein: 14, carbs: 3, fat: 14, fiber: 0.5, type: "nonveg", meal: ["breakfast"], category: "protein" },
  { name: "Keema (Minced Mutton)", serving: "1 cup (200g)", cal: 320, protein: 28, carbs: 6, fat: 22, fiber: 1, type: "nonveg", meal: ["lunch", "dinner"], category: "curries" },
  { name: "Chicken Soup (Clear)", serving: "1 bowl (250ml)", cal: 80, protein: 12, carbs: 3, fat: 2, fiber: 0.5, type: "nonveg", meal: ["snack"], category: "soups" },
  { name: "Tomato Soup", serving: "1 bowl (250ml)", cal: 70, protein: 2, carbs: 12, fat: 1.5, fiber: 2, type: "vegan", meal: ["snack"], category: "soups" },
  { name: "Mixed Veg Soup", serving: "1 bowl (250ml)", cal: 60, protein: 2, carbs: 10, fat: 1, fiber: 3, type: "vegan", meal: ["snack"], category: "soups" },
  { name: "Dal Soup (Lentil Soup)", serving: "1 bowl (250ml)", cal: 140, protein: 9, carbs: 22, fat: 1.5, fiber: 4, type: "veg", meal: ["snack"], category: "soups" },
];

export const FOOD_CATEGORIES = [
  "All", "protein", "grains", "legumes", "vegetables", "fruits", "nuts", "seeds",
  "dairy", "fats", "snacks", "curries", "rice_dishes", "salads", "soups",
  "supplements", "beverages", "sweeteners", "desserts",
];

export const MEAL_TYPES = [
  "All Meals", "breakfast", "lunch", "dinner", "snack", "pre", "post",
];

const RECIPES: Recipe[] = [
  {
    name: "High Protein Paneer Bhurji",
    time: "15 min", cal: 280, protein: 22, difficulty: "Easy",
    type: "veg", meal: "breakfast",
    ingredients: ["200g paneer (crumbled)", "1 onion (chopped)", "1 tomato (chopped)", "2 green chilies", "1/2 tsp turmeric", "1/2 tsp cumin seeds", "Salt, pepper", "Fresh coriander"],
    instructions: ["Heat oil in a pan. Add cumin seeds and green chilies.", "Add onions and sauté until golden.", "Add tomatoes and cook until soft. Add spices.", "Add crumbled paneer and mix well. Cook 3-4 min.", "Garnish with coriander. Serve hot with toast or roti."],
  },
  {
    name: "Masala Oats Upma",
    time: "10 min", cal: 210, protein: 7, difficulty: "Easy",
    type: "veg", meal: "breakfast",
    ingredients: ["1 cup oats", "1 onion (chopped)", "1 tomato (chopped)", "Mixed veggies (peas, carrot, beans)", "Mustard seeds, curry leaves", "1 green chili", "Lemon juice"],
    instructions: ["Dry roast oats for 2 min and set aside.", "Heat oil. Add mustard seeds, curry leaves, green chili.", "Add onions and sauté. Add veggies and cook 3 min.", "Add 1.5 cups water, salt, and bring to boil.", "Add oats, stir, and cook 3-4 min until done.", "Squeeze lemon juice and serve hot."],
  },
  {
    name: "Grilled Chicken Salad",
    time: "20 min", cal: 250, protein: 32, difficulty: "Easy",
    type: "nonveg", meal: "lunch",
    ingredients: ["200g chicken breast", "Mixed salad greens", "1 cucumber (diced)", "1 tomato (diced)", "1/2 onion (sliced)", "Olive oil, lemon juice", "Salt, pepper, oregano"],
    instructions: ["Season chicken with salt, pepper, and oregano.", "Grill chicken on pan for 5-6 min each side.", "Let rest 3 min, then slice.", "Toss vegetables with olive oil and lemon juice.", "Top with sliced chicken and serve."],
  },
  {
    name: "Moong Dal Chilla (Protein Pancake)",
    time: "15 min", cal: 180, protein: 10, difficulty: "Easy",
    type: "veg", meal: "breakfast",
    ingredients: ["1 cup moong dal (soaked 4 hrs)", "1 green chili", "1/2 inch ginger", "Salt, turmeric", "1/2 onion (chopped)", "Oil for cooking"],
    instructions: ["Grind soaked moong dal with chili and ginger into a smooth batter.", "Add salt, turmeric, and chopped onion. Mix well.", "Heat a pan. Pour batter and spread into a circle.", "Cook 2 min each side until golden.", "Serve with mint chutney or ketchup."],
  },
  {
    name: "Chicken Breast with Steamed Veggies",
    time: "25 min", cal: 320, protein: 35, difficulty: "Medium",
    type: "nonveg", meal: "dinner",
    ingredients: ["200g chicken breast", "Broccoli, carrots, beans", "Garlic ( minced)", "Olive oil", "Salt, pepper, rosemary", "Lemon juice"],
    instructions: ["Season chicken with salt, pepper, and rosemary.", "Pan sear chicken 5 min each side until cooked through.", "Steam vegetables for 5-6 minutes.", "Sauté garlic in olive oil for 30 sec.", "Serve chicken with vegetables and lemon drizzle."],
  },
  {
    name: "Post-Workout Protein Smoothie",
    time: "5 min", cal: 290, protein: 28, difficulty: "Easy",
    type: "veg", meal: "post",
    ingredients: ["1 scoop whey protein", "1 banana", "1 cup milk (200ml)", "1 tbsp peanut butter", "1/2 tsp cinnamon", "Ice cubes"],
    instructions: ["Add all ingredients to a blender.", "Blend until smooth (30-45 sec).", "Pour into a glass and enjoy immediately after workout."],
  },
  {
    name: "Pre-Workout Energy Oats",
    time: "10 min", cal: 320, protein: 15, difficulty: "Easy",
    type: "veg", meal: "pre",
    ingredients: ["1/2 cup oats", "1 cup milk", "1 banana (sliced)", "1 tbsp peanut butter", "1 tbsp honey", "1 tbsp chia seeds"],
    instructions: ["Cook oats in milk for 5 min.", "Top with banana slices, peanut butter, and honey.", "Sprinkle chia seeds. Eat 1-2 hours before workout."],
  },
  {
    name: "High Protein Dal Khichdi",
    time: "30 min", cal: 280, protein: 14, difficulty: "Easy",
    type: "veg", meal: "dinner",
    ingredients: ["1/2 cup rice", "1/2 cup moong dal", "1 tbsp ghee", "Cumin seeds, turmeric", "1 onion, 1 tomato", "Salt, ginger"],
    instructions: ["Wash rice and dal. Soak 10 min.", "Heat ghee. Add cumin seeds, ginger, onion.", "Sauté until golden. Add tomato and spices.", "Add rice, dal, and 3 cups water.", "Cook on medium for 20 min until soft.", "Serve hot with curd or pickle."],
  },
  {
    name: "Sprouts Chaat (Healthy Snack)",
    time: "10 min", cal: 140, protein: 10, difficulty: "Easy",
    type: "vegan", meal: "snack",
    ingredients: ["1 cup mixed sprouts (steamed)", "1 onion (chopped)", "1 tomato (chopped)", "Chaat masala, lemon juice", "Green chutney", "Fresh coriander"],
    instructions: ["Steam sprouts for 5 min and cool.", "Mix with chopped onion and tomato.", "Add chaat masala, lemon juice, and salt.", "Drizzle green chutney and garnish with coriander.", "Serve fresh as a healthy snack."],
  },
  {
    name: "Egg White Omelette",
    time: "10 min", cal: 120, protein: 22, difficulty: "Easy",
    type: "nonveg", meal: "breakfast",
    ingredients: ["4 egg whites", "1/4 cup chopped onion", "1/4 cup chopped capsicum", "Salt, pepper", "1 tsp olive oil"],
    instructions: ["Whisk egg whites with salt and pepper.", "Heat olive oil in a non-stick pan.", "Sauté vegetables for 1 min.", "Pour egg whites over vegetables.", "Cook 2 min, flip, cook 1 more minute.", "Serve with toast or alone."],
  },
  {
    name: "Tandoori Chicken Wrap",
    time: "20 min", cal: 350, protein: 30, difficulty: "Medium",
    type: "nonveg", meal: "lunch",
    ingredients: ["200g chicken (cubed)", "2 tbsp yogurt", "Tandoori masala, ginger-garlic paste", "1 whole wheat tortilla", "Lettuce, onion rings", "Mint chutney"],
    instructions: ["Marinate chicken in yogurt, masala, and paste for 1 hr.", "Grill or bake chicken until cooked (12 min at 200°C).", "Warm tortilla. Spread mint chutney.", "Layer lettuce, chicken, and onion rings.", "Roll tightly and serve."],
  },
];

const CATEGORY_ICONS: Record<string, ReactNode> = {
  protein: <Beef className="w-4 h-4" />,
  grains: <Wheat className="w-4 h-4" />,
  legumes: <Soup className="w-4 h-4" />,
  vegetables: <Salad className="w-4 h-4" />,
  fruits: <Apple className="w-4 h-4" />,
  nuts: <Brain className="w-4 h-4" />,
  seeds: <Flame className="w-4 h-4" />,
  dairy: <Milk className="w-4 h-4" />,
  snacks: <Coffee className="w-4 h-4" />,
  curries: <Soup className="w-4 h-4" />,
  supplements: <Zap className="w-4 h-4" />,
  beverages: <Droplet className="w-4 h-4" />,
  desserts: <Cake className="w-4 h-4" />,
  salads: <Salad className="w-4 h-4" />,
  rice_dishes: <Wheat className="w-4 h-4" />,
  fats: <Flame className="w-4 h-4" />,
  sweeteners: <Coffee className="w-4 h-4" />,
  soups: <Soup className="w-4 h-4" />,
};

const MEAL_ICONS: Record<string, ReactNode> = {
  breakfast: <Sun className="w-4 h-4" />,
  lunch: <Sun className="w-4 h-4" />,
  dinner: <Moon className="w-4 h-4" />,
  snack: <Coffee className="w-4 h-4" />,
  pre: <Zap className="w-4 h-4" />,
  post: <Heart className="w-4 h-4" />,
};

function bar(w: number, max: number, color: string) {
  return (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex-1">
      <div className="h-full rounded-full" style={{ width: `${Math.min((w / max) * 100, 100)}%`, backgroundColor: color }} />
    </div>
  );
}

function macroBar(label: string, value: number, max: number, color: string, unit: string) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-14">{label}</span>
      {bar(value, max, color)}
      <span className="text-gray-400 w-14 text-right">{value.toFixed(1)}{unit}</span>
    </div>
  );
}

/* ── Food Database ── */
export function FoodDatabase() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [meal, setMeal] = useState("All Meals");
  const [diet, setDiet] = useState("all");
  const [sort, setSort] = useState("name");
  const [selected, setSelected] = useState<Food | null>(null);

  const filtered = useMemo(() => {
    let items = [...FOODS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((f) => f.name.toLowerCase().includes(q) || f.category.includes(q));
    }
    if (category !== "All") items = items.filter((f) => f.category === category);
    if (meal !== "All Meals") items = items.filter((f) => f.meal.includes(meal));
    if (diet === "veg") items = items.filter((f) => f.type === "veg" || f.type === "vegan");
    else if (diet === "nonveg") items = items.filter((f) => f.type === "nonveg");
    else if (diet === "vegan") items = items.filter((f) => f.type === "vegan");
    if (sort === "cal") items.sort((a, b) => a.cal - b.cal);
    else if (sort === "protein") items.sort((a, b) => b.protein - a.protein);
    else if (sort === "carbs") items.sort((a, b) => a.carbs - b.carbs);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [search, category, meal, diet, sort]);

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search Indian foods..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] text-white placeholder-gray-600 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ key: "all", label: "All" }, { key: "veg", label: "Veg" }, { key: "nonveg", label: "Non-Veg" }, { key: "vegan", label: "Vegan" }].map((d) => (
            <button key={d.key} onClick={() => setDiet(d.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${diet === d.key ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}>{d.label}</button>
          ))}
        </div>
      </div>

      {/* Category + Meal + Sort pills */}
      <div className="flex flex-wrap gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs">
          {FOOD_CATEGORIES.map((c) => <option key={c} value={c} className="bg-gray-900">{c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
        </select>
        <select value={meal} onChange={(e) => setMeal(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs">
          {MEAL_TYPES.map((m) => <option key={m} value={m} className="bg-gray-900">{m.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs">
          <option value="name" className="bg-gray-900">Name</option>
          <option value="cal" className="bg-gray-900">Calories (low)</option>
          <option value="protein" className="bg-gray-900">Protein (high)</option>
          <option value="carbs" className="bg-gray-900">Carbs (low)</option>
        </select>
        <span className="text-xs text-gray-500 py-1.5">{filtered.length} foods</span>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((f) => (
          <motion.button
            key={f.name} layout
            onClick={() => setSelected(selected?.name === f.name ? null : f)}
            className="glass rounded-xl p-3 border border-white/5 hover:border-[#DC2626]/30 transition-all text-left"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-medium text-white leading-tight">{f.name}</p>
              <span className="text-[10px] text-gray-500 flex-shrink-0 whitespace-nowrap bg-white/5 px-1.5 py-0.5 rounded">{f.serving}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              {CATEGORY_ICONS[f.category] && <span className="flex items-center gap-1">{CATEGORY_ICONS[f.category]}<span>{f.category}</span></span>}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${f.type === "veg" ? "bg-green-500/10 text-green-400" : f.type === "nonveg" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}>{f.type === "veg" ? "V" : f.type === "nonveg" ? "NV" : "VG"}</span>
            </div>
            <div className="space-y-1">
              {macroBar("Calories", f.cal, 500, "#F59E0B", "")}
              {macroBar("Protein", f.protein, 40, "#EF4444", "g")}
              {macroBar("Carbs", f.carbs, 60, "#3B82F6", "g")}
              {macroBar("Fat", f.fat, 30, "#8B5CF6", "g")}
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No foods found. Try a different search.</p>}

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.serving} · {selected.category.replace(/_/g, " ")}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/5 rounded"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <ResultCard label="Calories" value={selected.cal} unit="" color="#F59E0B" />
              <ResultCard label="Protein" value={selected.protein} unit="g" color="#EF4444" />
              <ResultCard label="Carbs" value={selected.carbs} unit="g" color="#3B82F6" />
              <ResultCard label="Fat" value={selected.fat} unit="g" color="#8B5CF6" />
            </div>
            <div className="space-y-2 mb-4">
              {macroBar("Fiber", selected.fiber, 20, "#22C55E", "g")}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.meal.map((m) => (
                <span key={m} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] text-gray-400 flex items-center gap-1">
                  {MEAL_ICONS[m]} {m}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ label, value, unit, color }: { label: string; value: number; unit: string; color?: string }) {
  return (
    <div className="glass rounded-xl p-3 border border-white/5 text-center">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold" style={{ color: color || "#DC2626" }}>{value}<span className="text-xs text-gray-500 ml-0.5">{unit}</span></p>
    </div>
  );
}

/* ── Recipes ── */
export function RecipeSection() {
  const [search, setSearch] = useState(""); const [diet, setDiet] = useState("all"); const [meal] = useState("all");
  const [selected, setSelected] = useState<Recipe | null>(null);

  const filtered = RECIPES.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (diet !== "all" && r.type !== diet) return false;
    if (meal !== "all" && r.meal !== meal) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] text-white placeholder-gray-600 text-sm" />
        <div className="flex gap-2">
          {[{ k: "all", l: "All" }, { k: "veg", l: "Veg" }, { k: "nonveg", l: "Non-Veg" }].map((d) => (
            <button key={d.k} onClick={() => setDiet(d.k)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${diet === d.k ? "bg-[#DC2626] text-white" : "bg-white/5 text-gray-400"}`}>{d.l}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((r) => (
          <motion.button key={r.name} layout
            onClick={() => setSelected(selected?.name === r.name ? null : r)}
            className="glass rounded-xl p-4 border border-white/5 hover:border-[#DC2626]/30 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">{r.name}</h4>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${r.type === "veg" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{r.type === "veg" ? "V" : "NV"}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{r.cal} kcal</span>
              <span className="flex items-center gap-1"><Beef className="w-3 h-3" />{r.protein}g protein</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-1">{r.meal} · {r.difficulty}</p>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.meal} · {selected.time} · {selected.difficulty}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/5 rounded"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="flex gap-3 mb-4">
              <ResultCard label="Calories" value={selected.cal} unit="kcal" color="#F59E0B" />
              <ResultCard label="Protein" value={selected.protein} unit="g" color="#EF4444" />
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {selected.ingredients.map((i, idx) => <li key={idx} className="text-sm text-gray-400 flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[#DC2626]" />{i}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Instructions</h4>
              <ol className="space-y-2">
                {selected.instructions.map((s, idx) => <li key={idx} className="text-sm text-gray-400 flex gap-2"><span className="font-bold text-[#DC2626] min-w-[20px]">{idx + 1}.</span>{s}</li>)}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Meal Planner ── */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Snack", "Dinner"];

export function MealPlanner() {
  const [plan, setPlan] = useState<Record<string, Record<string, string>>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("gym56_meal_plan") : null;
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedCell, setSelectedCell] = useState<{ day: string; meal: string } | null>(null);
  const [foodSearch, setFoodSearch] = useState("");

  const savePlan = (p: typeof plan) => {
    setPlan(p);
    localStorage.setItem("gym56_meal_plan", JSON.stringify(p));
  };

  const foodOptions = FOODS.filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase())).slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left text-gray-500 font-medium" />
              {MEALS.map((m) => <th key={m} className="p-2 text-gray-500 font-medium text-center">{m}</th>)}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day} className="border-t border-white/5">
                <td className="p-2 text-gray-400 font-medium whitespace-nowrap">{day}</td>
                {MEALS.map((meal) => {
                  const cell = plan[day]?.[meal];
                  return (
                    <td key={meal} className="p-1">
                      <button
                        onClick={() => setSelectedCell({ day, meal })}
                        className="w-full min-h-[50px] glass rounded-lg p-2 border border-white/5 hover:border-[#DC2626]/30 transition-all text-left"
                      >
                        {cell ? (
                          <span className="text-xs text-white">{cell}</span>
                        ) : (
                          <span className="text-[10px] text-gray-600">+ Add</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedCell && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass rounded-2xl border border-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">{selectedCell.day} · {selectedCell.meal}</p>
              <div className="flex gap-2">
                {plan[selectedCell.day]?.[selectedCell.meal] && (
                  <button onClick={() => {
                    const p = { ...plan };
                    if (p[selectedCell.day]) delete p[selectedCell.day][selectedCell.meal];
                    savePlan(p);
                  }} className="text-red-400 text-xs hover:underline">Remove</button>
                )}
                <button onClick={() => setSelectedCell(null)}><X className="w-4 h-4 text-gray-500" /></button>
              </div>
            </div>
            <input type="text" placeholder="Search foods..." value={foodSearch} onChange={(e) => setFoodSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {foodOptions.map((f) => (
                <button key={f.name} onClick={() => {
                  const p = { ...plan };
                  if (!p[selectedCell.day]) p[selectedCell.day] = {};
                  p[selectedCell.day][selectedCell.meal] = f.name;
                  savePlan(p);
                  setSelectedCell(null);
                }} className="glass rounded-lg p-2 border border-white/5 hover:border-[#DC2626]/30 text-left">
                  <p className="text-xs text-white font-medium">{f.name}</p>
                  <p className="text-[10px] text-gray-500">{f.cal} kcal · {f.protein}g P</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">Drag-free meal planner — tap to add foods</p>
        <button onClick={() => { setPlan({}); localStorage.removeItem("gym56_meal_plan"); }} className="text-xs text-red-400 hover:underline">Clear week</button>
      </div>
    </div>
  );
}

/* ── Calorie Tracker ── */
export function CalorieTracker() {
  const [entries, setEntries] = useState<Array<{ id: string; food: string; cal: number; protein: number; meal: string }>>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("gym56_calorie_log") : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState("breakfast");

  const total = useMemo(() => entries.reduce((s, e) => ({ cal: s.cal + e.cal, protein: s.protein + e.protein }), { cal: 0, protein: 0 }), [entries]);

  const addFood = (food: Food) => {
    setEntries([...entries, { id: Date.now().toString(), food: food.name, cal: food.cal, protein: food.protein, meal }]);
    setSearch("");
  };

  const removeEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("gym56_calorie_log", JSON.stringify(updated));
  };

  const foods = FOODS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Add food..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#DC2626] focus:outline-none focus:ring-1 focus:ring-[#DC2626] text-white placeholder-gray-600 text-sm" />
        </div>
        <select value={meal} onChange={(e) => setMeal(e.target.value)} className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm">
          <option value="breakfast" className="bg-gray-900">Breakfast</option>
          <option value="lunch" className="bg-gray-900">Lunch</option>
          <option value="snack" className="bg-gray-900">Snack</option>
          <option value="dinner" className="bg-gray-900">Dinner</option>
        </select>
      </div>

      {search && foods.length > 0 && (
        <div className="glass rounded-xl border border-white/5 overflow-hidden">
          {foods.map((f) => (
            <button key={f.name} onClick={() => addFood(f)}
              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-all text-left border-b border-white/5 last:border-0">
              <div>
                <p className="text-sm text-white">{f.name}</p>
                <p className="text-[10px] text-gray-500">{f.serving}</p>
              </div>
              <p className="text-sm text-gray-400">{f.cal} kcal</p>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <ResultCard label="Total Calories" value={total.cal} unit="kcal" color="#F59E0B" />
        <ResultCard label="Total Protein" value={total.protein} unit="g" color="#EF4444" />
        <ResultCard label="Entries" value={entries.length} unit="" />
      </div>

      {entries.length > 0 && (
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {[...entries].reverse().map((e) => (
            <div key={e.id} className="flex items-center justify-between glass rounded-lg px-3 py-2 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">{e.meal}</span>
                <span className="text-sm text-white">{e.food}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{e.cal} kcal</span>
                <button onClick={() => removeEntry(e.id)} className="text-gray-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => { setEntries([]); localStorage.removeItem("gym56_calorie_log"); }}
        className="text-xs text-red-400 hover:underline">Clear all entries</button>
    </div>
  );
}

/* ── Meal Collections ── */
export function MealCollections() {
  const collections = [
    { title: "Protein Rich Foods", filter: (f: Food) => f.protein >= 15, color: "#EF4444", icon: <Beef className="w-5 h-5" /> },
    { title: "Healthy Snacks", filter: (f: Food) => f.cal < 150 && f.category === "snacks", color: "#F59E0B", icon: <Coffee className="w-5 h-5" /> },
    { title: "Pre-Workout Meals", filter: (f: Food) => f.meal.includes("pre") || (f.meal.includes("breakfast") && f.carbs > 20), color: "#3B82F6", icon: <Zap className="w-5 h-5" /> },
    { title: "Post-Workout Meals", filter: (f: Food) => f.meal.includes("post") || (f.cal > 200 && f.protein > 15), color: "#22C55E", icon: <Heart className="w-5 h-5" /> },
    { title: "Vegetarian Favorites", filter: (f: Food) => f.type === "veg", color: "#10B981", icon: <Salad className="w-5 h-5" /> },
    { title: "Non-Vegetarian", filter: (f: Food) => f.type === "nonveg", color: "#DC2626", icon: <Beef className="w-5 h-5" /> },
    { title: "Weight Loss Meals", filter: (f: Food) => f.cal < 200 && f.protein > 10 && f.fat < 10, color: "#8B5CF6", icon: <Flame className="w-5 h-5" /> },
    { title: "Muscle Gain Meals", filter: (f: Food) => f.cal > 250 && f.protein > 20, color: "#EC4899", icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {collections.map((col) => {
        const items = FOODS.filter(col.filter).slice(0, 5);
        return (
          <motion.div key={col.title} whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl border border-white/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${col.color}15` }}>
                <div style={{ color: col.color }}>{col.icon}</div>
              </div>
              <h3 className="font-semibold text-white text-sm">{col.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {items.map((f) => (
                <li key={f.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 truncate">{f.name}</span>
                  <span className="text-gray-600 flex-shrink-0 ml-2">{f.cal} kcal · {f.protein}g P</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Nutrition Facts Card (for a given food) ── */
export function NutritionFacts({ food, color = "#DC2626" }: { food: Food; color?: string }) {
  const total = food.cal;
  const pCal = food.protein * 4;
  const cCal = food.carbs * 4;
  const fCal = food.fat * 9;

  return (
    <div className="glass rounded-2xl border border-white/5 p-6 max-w-sm">
      <h3 className="text-lg font-bold text-white mb-1">{food.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{food.serving}</p>
      <div className="text-center mb-4">
        <p className="text-4xl font-bold" style={{ color }}>{food.cal}</p>
        <p className="text-xs text-gray-500">Calories per serving</p>
      </div>
      <div className="space-y-3 border-t border-white/5 pt-4">
        <div className="flex justify-between text-sm"><span className="text-gray-400">Protein</span><span className="text-white font-medium">{food.protein}g <span className="text-gray-600">({((pCal / total) * 100).toFixed(0)}%)</span></span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Carbohydrates</span><span className="text-white font-medium">{food.carbs}g <span className="text-gray-600">({((cCal / total) * 100).toFixed(0)}%)</span></span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Fat</span><span className="text-white font-medium">{food.fat}g <span className="text-gray-600">({((fCal / total) * 100).toFixed(0)}%)</span></span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-400">Fiber</span><span className="text-white font-medium">{food.fiber}g</span></div>
      </div>
      <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden flex">
        <div style={{ width: `${(pCal / total) * 100}%`, backgroundColor: "#EF4444" }} />
        <div style={{ width: `${(cCal / total) * 100}%`, backgroundColor: "#3B82F6" }} />
        <div style={{ width: `${(fCal / total) * 100}%`, backgroundColor: "#8B5CF6" }} />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-600">
        <span>Protein {((pCal / total) * 100).toFixed(0)}%</span>
        <span>Carbs {((cCal / total) * 100).toFixed(0)}%</span>
        <span>Fat {((fCal / total) * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
