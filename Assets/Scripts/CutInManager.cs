using UnityEngine;
using TMPro;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine.Events;

[Serializable]
public class BooleanEvent : UnityEvent<bool> { }

public class CutInManager : MonoBehaviour
{
    [DllImport("__Internal")] private static extern void UpdateDropdowns(string jsonString);

    public static string currentCutInName;

    [Header("Cut-In Objects")]
    [SerializeField] private SpriteRenderer leftCutIn;
    [SerializeField] private SpriteRenderer rightCutIn;

    [Header("Cut-In Sprites")]
    [SerializeField] private List<Sprite> nonSpoilerSprites;
    private List<string> nonSpoilerSpriteNames = new();
    [SerializeField] private List<Sprite> spoilerSprites;
    private List<Sprite> allSprites = new();
    private List<string> allSpriteNames = new();

    private List<Sprite> currentSprites = new();
    private List<string> currentSpriteNames = new();

    [Header("Animators")]
    [SerializeField] private Animator previewAnimator;
    [SerializeField] private Animator renderAnimator;

    [Header("Events")]
    [SerializeField] private List<UnityEvent> normalEvents = new();
    [SerializeField] private List<BooleanEvent> boolEvents = new();

    [Header("Testing")]
    [SerializeField] private TMP_Dropdown leftDropdown;
    [SerializeField] private TMP_Dropdown rightDropdown;

    private int cutInHash = Animator.StringToHash("Cut In");

    private void Awake()
    {
        // Adds non-spoiler sprites to both spriteNames and allSpriteNames
        foreach (Sprite sprite in nonSpoilerSprites) 
        {
            nonSpoilerSpriteNames.Add(sprite.name);
            allSprites.Add(sprite);
            allSpriteNames.Add(sprite.name);
        }
        // Adds spoiler sprites to allSprite
        foreach (Sprite spoilerSprite in spoilerSprites) 
        {
            allSprites.Add(spoilerSprite);
            allSpriteNames.Add(spoilerSprite.name); 
        }
        // Organizes allSprites
        allSprites.Sort(CompareByName);
        allSpriteNames.Sort();

        // Sets initial state to be non-spoilers
        currentSprites = nonSpoilerSprites;
        currentSpriteNames = nonSpoilerSpriteNames;
    }

    private void OnEnable()
    {
        ApplyThisDropdown();
        UpdateCutInName();
    }

    /*
     *  PUBLIC METHODS
     */
    public void ApplyThisDropdown()
    {
        UpdateDropdownItems(currentSpriteNames);
    }

    public void ToggleSpoilers(int spoilersOn)
    {
        switch (spoilersOn)
        {
            case 1:
                currentSpriteNames = allSpriteNames;
                currentSprites = allSprites;
                break;
            case 0:
                currentSpriteNames = nonSpoilerSpriteNames;
                currentSprites = nonSpoilerSprites;
                break;
        }

        UpdateDropdownItems(currentSpriteNames);
    }

    public void ChangeRightCutIn(string name)
    {
        for (int i = 0; i < currentSprites.Count; i++)
        {
            if (currentSprites[i].name == name)
            {
                rightCutIn.sprite = currentSprites[i];
            }
        }
        
        UpdateCutInName();
    }

    public void ChangeRightCutIn(int index)
    {
        rightCutIn.sprite = currentSprites[index];
        UpdateCutInName();
    }

    public void ChangeLeftCutIn(string name)
    {
        for (int i = 0; i < currentSprites.Count; i++)
        {
            if (currentSprites[i].name == name)
            {
                leftCutIn.sprite = currentSprites[i];
            }
        }

        UpdateCutInName();
    }

    public void ChangeLeftCutIn(int index)
    {
        leftCutIn.sprite = currentSprites[index];
        UpdateCutInName();
    }

    public void Preview()
    {
        previewAnimator.SetTrigger(cutInHash);
    }

    public void CallNormalEvent(int index)
    {
        normalEvents[index].Invoke();
    }
    
    public void CallBooleanEvent(string code)
    {
        int eventIndex = int.Parse(code.Substring(0, 1));

        int boolInt = int.Parse(code.Substring(2, 1));
        bool value = false;
        if (boolInt == 1) { value = true; }

        boolEvents[eventIndex].Invoke(value);
    }

    /*
     *  PRIVATE METHODS
     */
    private void UpdateDropdownItems(List<string> names)
    {
        ChangeRightCutIn(currentSpriteNames[0]);
        ChangeLeftCutIn(currentSpriteNames[0]);

        UpdateDropdowns(JsonCompiler.CompileDropdownOptions(names));
    }

    private void UpdateCutInName()
    {
        string cutInName = "";

        cutInName += leftCutIn.sprite.name;
        cutInName += "_VS_";
        cutInName += rightCutIn.sprite.name;

        currentCutInName = cutInName;
    }

    private static int CompareByName(Sprite sprite1, Sprite sprite2)
    {
        return string.Compare(sprite1.name, sprite2.name);
    }
}
