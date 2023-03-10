async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    ContainerUnpack(data) {
      // assembly/containerContent/ContainerUnpack(~lib/typedarray/Uint8Array) => ~lib/array/Array<~lib/typedarray/Uint8Array>
      data = __lowerTypedArray(Uint8Array, 4, 0, data) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint8Array, __getU32(pointer)), 2, exports.ContainerUnpack(data) >>> 0);
    },
    ContainerPack(bodyBytes, nonce) {
      // assembly/containerContent/ContainerPack(~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array) => ~lib/typedarray/Uint8Array
      bodyBytes = __retain(__lowerTypedArray(Uint8Array, 4, 0, bodyBytes) || __notnull());
      nonce = __lowerTypedArray(Uint8Array, 4, 0, nonce) || __notnull();
      try {
        return __liftTypedArray(Uint8Array, exports.ContainerPack(bodyBytes, nonce) >>> 0);
      } finally {
        __release(bodyBytes);
      }
    },
    MessageContentPack(subjectBytes, signature, attacheds, previousMessageAddress, bodyBytes) {
      // assembly/messageContent/MessageContentPack(~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array, ~lib/typedarray/Uint8Array) => ~lib/typedarray/Uint8Array
      subjectBytes = __retain(__lowerTypedArray(Uint8Array, 4, 0, subjectBytes) || __notnull());
      signature = __retain(__lowerTypedArray(Uint8Array, 4, 0, signature) || __notnull());
      attacheds = __retain(__lowerTypedArray(Uint8Array, 4, 0, attacheds) || __notnull());
      previousMessageAddress = __retain(__lowerTypedArray(Uint8Array, 4, 0, previousMessageAddress) || __notnull());
      bodyBytes = __lowerTypedArray(Uint8Array, 4, 0, bodyBytes) || __notnull();
      try {
        return __liftTypedArray(Uint8Array, exports.MessageContentPack(subjectBytes, signature, attacheds, previousMessageAddress, bodyBytes) >>> 0);
      } finally {
        __release(subjectBytes);
        __release(signature);
        __release(attacheds);
        __release(previousMessageAddress);
      }
    },
    MessageContentUnpack(data) {
      // assembly/messageContent/MessageContentUnpack(~lib/typedarray/Uint8Array) => ~lib/array/Array<~lib/typedarray/Uint8Array>
      data = __lowerTypedArray(Uint8Array, 4, 0, data) || __notnull();
      return __liftArray(pointer => __liftTypedArray(Uint8Array, __getU32(pointer)), 2, exports.MessageContentUnpack(data) >>> 0);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __liftArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      dataStart = __getU32(pointer + 4),
      length = __dataview.getUint32(pointer + 12, true),
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(dataStart + (i << align >>> 0));
    return values;
  }
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    return new constructor(
      memory.buffer,
      __getU32(pointer + 4),
      __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
    ).slice();
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__new(12, id) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  ContainerUnpack,
  ContainerPack,
  MessageContentPack,
  MessageContentUnpack
} = await (async url => instantiate(
  await (async () => {
    try { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
    catch { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
  })(), {
  }
))(new URL("debug.wasm", import.meta.url));
