using UnityEngine;
using System.Collections.Generic;

public class JsonCompiler : MonoBehaviour
{
    public class OptionsWrapper
    {
        public string[] options;
    }
    public static string CompileDropdownOptions(List<string> options)
    {
        OptionsWrapper wrapper = new();
        wrapper.options = options.ToArray();

        return JsonUtility.ToJson(wrapper);
    }
}
