// Config
const BACKEND_URL = 'http://localhost:3000'; // Default for local dev, will update for deployment

// DOM Elements
const recipeGrid = document.getElementById('recipe-grid');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const recipeForm = document.getElementById('recipe-form');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');
const modalTitle = document.getElementById('modal-title');

// State
let recipes = [];

// Initialize
document.addEventListener('DOMContentLoaded', fetchRecipes);

// Fetch all recipes (Read)
async function fetchRecipes() {
    showState(loadingState);
    try {
        const response = await fetch(`${BACKEND_URL}/recipes`);
        if (!response.ok) throw new Error('Failed to fetch');
        recipes = await response.json();
        renderRecipes();
    } catch (error) {
        console.error(error);
        showState(errorState);
    }
}

// Render recipes to UI
function renderRecipes() {
    recipeGrid.innerHTML = '';
    
    if (recipes.length === 0) {
        showState(emptyState);
        return;
    }

    showState(recipeGrid);
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.title}</h3>
            <div class="ingredients"><strong>Ingredients:</strong><br>${recipe.ingredients}</div>
            <div class="instructions"><strong>Steps:</strong><br>${recipe.instructions.substring(0, 100)}${recipe.instructions.length > 100 ? '...' : ''}</div>
            ${recipe.source_url ? `<a href="${recipe.source_url}" target="_blank" class="btn-secondary" style="text-decoration: none; text-align: center; font-size: 0.8rem;">View Source</a>` : ''}
            <div class="card-actions">
                <button onclick="editRecipe(${recipe.id})" class="btn-secondary">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})" class="btn-secondary" style="color: var(--error); border-color: var(--error)">Delete</button>
            </div>
        `;
        recipeGrid.appendChild(card);
    });
}

// Helper: Show specific state
function showState(element) {
    [loadingState, errorState, emptyState, recipeGrid].forEach(el => el.classList.add('hidden'));
    element.classList.remove('hidden');
}

// Modal Logic
addBtn.addEventListener('click', () => {
    recipeForm.reset();
    document.getElementById('recipe-id').value = '';
    modalTitle.textContent = 'New Recipe';
    modal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => modal.classList.add('hidden'));

// Create or Update
recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('recipe-id').value;
    const recipeData = {
        title: document.getElementById('title').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value,
        source_url: document.getElementById('source_url').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${BACKEND_URL}/recipes/${id}` : `${BACKEND_URL}/recipes`;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData)
        });

        if (!response.ok) throw new Error('Save failed');
        
        modal.classList.add('hidden');
        fetchRecipes();
    } catch (error) {
        alert('Failed to save recipe. Is the oven on? (Backend error)');
    }
});

// Delete Recipe
async function deleteRecipe(id) {
    if (!confirm('Are you sure you want to remove this recipe from your vault?')) return;

    try {
        const response = await fetch(`${BACKEND_URL}/recipes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete failed');
        fetchRecipes();
    } catch (error) {
        alert('Failed to delete recipe.');
    }
}

// Edit Recipe (Pre-fill form)
function editRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    document.getElementById('recipe-id').value = recipe.id;
    document.getElementById('title').value = recipe.title;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;
    document.getElementById('source_url').value = recipe.source_url || '';

    modalTitle.textContent = 'Edit Recipe';
    modal.classList.remove('hidden');
}
