using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;
using Unity.VisualScripting;

public class CutInManager : MonoBehaviour
{
    [HideInInspector] public static string currentCutInName;

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

    [Header("Testing")]
    [SerializeField] private bool activeAtStart = true;
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

        // If Active At Start 
        if (activeAtStart)
        {
            ApplyThisDropdown();
            UpdateCutInName();
        }
    }

    /*
     *  PUBLIC METHODS
     */
    public void ApplyThisDropdown()
    {
        UpdateDropdownItems(currentSpriteNames);
    }

    public void ToggleSpoilers(bool spoilersOn)
    {
        switch (spoilersOn)
        {
            case true:
                currentSpriteNames = allSpriteNames;
                currentSprites = allSprites;
                break;
            case false:
                currentSpriteNames = nonSpoilerSpriteNames;
                currentSprites = nonSpoilerSprites;
                break;
        }

        UpdateDropdownItems(currentSpriteNames);
    }

    public void ChangeRightCutIn(int index)
    {
        rightCutIn.sprite = currentSprites[index];
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

    /*
     *  PRIVATE METHODS
     */
    private void UpdateDropdownItems(List<string> names)
    {
        leftDropdown.ClearOptions();
        rightDropdown.ClearOptions();

        leftDropdown.AddOptions(names);
        rightDropdown.AddOptions(names);

        ChangeRightCutIn(0);
        ChangeLeftCutIn(0);
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
