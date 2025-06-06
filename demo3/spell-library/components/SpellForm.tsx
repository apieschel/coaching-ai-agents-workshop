// components/SpellForm.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import styles from './SpellForm.module.css';

interface SpellFormProps {
  isEditMode: boolean;
  spellId?: number;
}

export default function SpellForm({ isEditMode, spellId }: SpellFormProps) {
  interface SpellData {
    name: string;
    description: string;
    pronunciation: string;
    seenMentioned: string;
    etymology: string;
    notes: string;
    knownPractitioners: string;
    additionalItems: string;
    image: string;
  }

  const [spellData, setSpellData] = useState<SpellData>({
    name: '',
    description: '',
    pronunciation: '',
    seenMentioned: '',
    etymology: '',
    notes: '',
    knownPractitioners: '',
    additionalItems: '',
    image: '',
  });


  useCopilotReadable({
    description: "The spell data",
    value: spellData,
  });

//  const [imageFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSpell = async () => {
      const response = await axios.get(`/api/spells/${spellId}`);
      const spell = response.data;
      setSpellData({
        ...spell,
        knownPractitioners: spell.knownPractitioners.join(', '),
      });
    };

    if (isEditMode && spellId) {
      fetchSpell();
    }
  }, [isEditMode, spellId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSpellData({ ...spellData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...spellData,
      knownPractitioners: spellData.knownPractitioners.split(',').map((s: string) => s.trim()),
      //image: imagePath,
    };

    if (isEditMode) {
      await axios.put(`/api/spells/${spellId}`, payload);
    } else {
      await axios.post('/api/spells', payload);
    }

    router.push('/spells');
  };

  useCopilotAction(
    {
      // Define the name of the action
      name: "createSpell",
      // Provide a description for the action
      description: "Create a Harry Potter spell",
      // Define the parameters required for the action
      parameters: [
        {
          name: "spell",
          type: "object",
          description: "a Harry Potter spell",
          attributes: [{
            name: "name",
            type: "string",
            description: "Name of the spell"
              },
              {
            name: "description",
            type: "string",
            description: "The description of the spell"
              },
              {
            name: "pronunciation",
            type: "string",
            description: "The pronunciation of the spell"
              },
              {
            name: "seenMentioned",
            type: "string",
            description: "Movies where the spell was mentioned"
              },
              {
            name: "etymology",
            type: "string",
            description: "Origin and history of the spell name"
              },
              {
            name: "notes",
            type: "string",
            description: "Additional notes about the spell"
              },
              {
            name: "knownPractitioners",
            type: "string",
            description: "Known practitioners of the spell"
              },
              {
            name: "additionalItems",
            type: "string",
            description: "Additional items related to the spell"
              },
              {
            name: "image",
            type: "string",
            description: "URL or reference to spell image"
              }
            ],
        },
      ],
      // Define the handler function to be executed when the action is called
      handler: async ({ spell }) => {
        setSpellData(spell as SpellData)
      },
    },
    // Empty dependency array, indicating this effect does not depend on any props or state
    [],
  );

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {isEditMode ? 'Edit Spell' : 'Add New Spell'}
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input 
            id="name"
            name="name" 
            value={spellData.name} 
            onChange={handleChange} 
            required 
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea 
            id="description"
            name="description" 
            value={spellData.description} 
            onChange={handleChange} 
            required 
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pronunciation">Pronunciation:</label>
          <input 
            id="pronunciation"
            name="pronunciation" 
            value={spellData.pronunciation} 
            onChange={handleChange} 
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="seenMentioned">Seen/Mentioned:</label>
          <textarea 
            id="seenMentioned"
            name="seenMentioned" 
            value={spellData.seenMentioned} 
            onChange={handleChange} 
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="etymology">Etymology:</label>
          <textarea 
            id="etymology"
            name="etymology" 
            value={spellData.etymology} 
            onChange={handleChange} 
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes:</label>
          <textarea 
            id="notes"
            name="notes" 
            value={spellData.notes} 
            onChange={handleChange} 
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="knownPractitioners">Known Practitioners (comma-separated):</label>
          <input 
            id="knownPractitioners"
            name="knownPractitioners" 
            value={spellData.knownPractitioners} 
            onChange={handleChange} 
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="additionalItems">Additional Items:</label>
          <textarea 
            id="additionalItems"
            name="additionalItems" 
            value={spellData.additionalItems} 
            onChange={handleChange} 
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            {isEditMode ? 'Update Spell' : 'Add Spell'}
          </button>
          <button 
            type="button" 
            onClick={() => router.back()} 
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
