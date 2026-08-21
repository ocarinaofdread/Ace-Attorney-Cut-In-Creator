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

    public class RenderInformationWrapper
    {
        public float fps;
        public float totalFrames;
        public int width;
        public int height;
        public string webpName;
    }
    public static string CompileWebpInformation(float fps, float frames, int width, int height, string webpName)
    {
        RenderInformationWrapper wrapper = new()
        {
            fps = fps,
            totalFrames = frames,
            width = width,
            height = height,
            webpName = webpName
        };

        return JsonUtility.ToJson(wrapper);
    }
}
